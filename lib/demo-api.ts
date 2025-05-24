import demoTranslations from "@/data/demo-translations.json";

export interface TranslationResult {
  translation: string;
  romaji?: string;
  notes?: string;
  audio?: string;
}

export function getDefaultText(language: string): string {
  const defaultPhrases = {
    en: "Hello, how are you?",
    ja: "こんにちは、お元気ですか？",
  };

  return (
    defaultPhrases[language as keyof typeof defaultPhrases] || defaultPhrases.en
  );
}

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  formality: string = "casual",
  targetDialect: string = "tokyo"
): Promise<TranslationResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find a matching phrase or use default
  const phrase = demoTranslations.phrases.find(
    (p: any) =>
      p.translations[sourceLanguage as keyof typeof p.translations]?.variants[
        formality as keyof (typeof p.translations)[typeof sourceLanguage]["variants"]
      ]?.text.toLowerCase() === text.toLowerCase()
  );

  if (
    phrase &&
    phrase.translations[targetLanguage as keyof typeof phrase.translations]
  ) {
    const translation =
      phrase.translations[targetLanguage as keyof typeof phrase.translations];
    const variant =
      translation.variants[formality as keyof typeof translation.variants];

    return {
      translation: variant.text,
      romaji: "romanization" in variant ? variant.romanization : undefined,
      notes: "note" in variant ? variant.note : undefined,
      // Use absolute path for demo audio files
      audio: variant.audio.startsWith("/")
        ? `${process.env.NEXT_PUBLIC_APP_URL || ""}${variant.audio}`
        : variant.audio,
    };
  }

  // Default response for non-matching text
  const defaultAudio = `/audio/greeting_${targetLanguage}_${formality}.mp3`;
  return {
    translation:
      targetLanguage === "ja"
        ? "こんにちは、元気ですか？"
        : "Hello, how are you?",
    romaji: targetLanguage === "ja" ? "Konnichiwa, genki desu ka?" : undefined,
    notes: "This is a demo translation",
    // audio: `${process.env.NEXT_PUBLIC_APP_URL || ''}${defaultAudio}`
    audio: "/audio/translation.mp3",
  };
}
