import { NextResponse } from "next/server";

const ALLOW_ORIGIN = "https://anydialect.duranirving.com";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE_NAME; // e.g. "Translations"
const AIRTABLE_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

async function logToAirtable(fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }] }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Airtable logging failed:", res.status, err);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request) {
  try {
    const {
      text,
      sourceLanguage,
      targetLanguage,
      targetDialect,
      speakerPronouns,
      listenerPronouns,
      formality,
      uid,
      userEmail,
    } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Access-Control-Allow-Origin": ALLOW_ORIGIN,
          },
        }
      );
    }

    let prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}${
      targetDialect ? ` in the ${targetDialect} dialect` : ""
    }. 
      
      If the target language has a non-Latin script, also provide a **romanized version**.
      
      ### **Translation Rules:**
      - **Use native slang, idioms, and cultural expressions as appropriate for the dialect.**
      - **Ensure the tone and rhythm match natural spoken language.**
      - **Formality Level:**
        ${
          formality
            ? `STRICTLY follow this formality level: "${formality}".`
            : "Choose the most natural formality for the context."
        }
        ${
          formality === "superior"
            ? `Use HONORIFIC and highly respectful language. Avoid casual or informal words.`
            : formality === "stranger"
            ? `Use POLITE and professional language.`
            : formality === "friend"
            ? `Use CASUAL and relaxed language.`
            : formality === "child"
            ? `Use SIMPLE and friendly language that a child would easily understand.`
            : ""
        }
      - **DO NOT use casual language if the formality level is 'superior' or 'stranger'.**
      - **Adapt the translation to fit the speaker’s pronouns (${
        speakerPronouns || "Detect if not provided"
      }).**
      - **Use appropriate sentence structure based on the listener’s pronouns (${
        listenerPronouns || "Detect if not provided"
      }).**
      - **Do NOT provide markdown, code blocks, or extra formatting. Return only valid JSON.**
      
      ### **Text to Translate:**  
      "${text}"
      
      ### **Expected JSON Response (DO NOT include markdown or code blocks):**
      {
        "translation": "[translated text with native dialect]",
        "romaji": "[romanized version, if applicable]",
        "detectedSpeakerPronouns": "[${
          speakerPronouns || "he/him, she/her, they/them, neutral"
        }]",
        "detectedListenerPronouns": "[${
          listenerPronouns || "he/him, she/her, they/them, neutral"
        }]",
        "formalityUsed": "[${formality || "auto-detected based on context"}]",
        "notes": "[EXPLAIN how formality was applied. For 'superior', specify how honorific speech was used. For 'stranger', mention polite forms. For 'friend', explain informal choices. If 'child', note simplifications.]"
      }
      `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a highly accurate translation assistant. " +
              "Your primary goal is to provide natural, culturally appropriate translations that strictly follow the requested formality, dialect, and pronoun usage. " +
              "Always respond in valid JSON format without any markdown or code blocks. " +
              "If the formality level is 'superior' or 'stranger', do NOT use casual speech. " +
              "If the dialect is specified, ensure the translation includes local expressions and slang used by native speakers. ",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Error from OpenAI API" },
        {
          status: response.status,
          headers: { "Access-Control-Allow-Origin": ALLOW_ORIGIN },
        }
      );
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error("Unexpected API response structure:", data);
      return NextResponse.json(
        { error: "Invalid response from translation service" },
        {
          status: 500,
          headers: { "Access-Control-Allow-Origin": ALLOW_ORIGIN },
        }
      );
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(data.choices[0].message.content.trim());
    } catch (parseError) {
      console.error("JSON Parse Error:", {
        error: parseError,
        content: data.choices[0].message.content,
      });
      return NextResponse.json(
        { error: "Failed to parse translation response" },
        {
          status: 500,
          headers: { "Access-Control-Allow-Origin": ALLOW_ORIGIN },
        }
      );
    }

    if (!jsonResponse.translation) {
      console.error("Invalid JSON response structure:", jsonResponse);
      return NextResponse.json(
        { error: "Invalid translation response format" },
        {
          status: 500,
          headers: { "Access-Control-Allow-Origin": ALLOW_ORIGIN },
        }
      );
    }

    // Log to Airtable
    const fieldsForAirtable = {
      Text: text,
      SourceLanguage: sourceLanguage,
      TargetLanguage: targetLanguage,
      TargetDialect: targetDialect || "",
      SpeakerPronouns: speakerPronouns || "",
      ListenerPronouns: listenerPronouns || "",
      Formality: formality || "",
      UID: uid || "",
      UserEmail: userEmail || "",
      Translation: jsonResponse.translation || "",
      Romaji: jsonResponse.romaji || "",
      FormalityUsed: jsonResponse.formalityUsed || "",
      Notes: jsonResponse.notes || "",
      // Timestamp: new Date().toISOString(),
    };

    try {
      await logToAirtable(fieldsForAirtable);
    } catch (e) {
      console.error("Airtable logging threw:", e);
    }

    return NextResponse.json(jsonResponse, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": ALLOW_ORIGIN } }
    );
  }
}
