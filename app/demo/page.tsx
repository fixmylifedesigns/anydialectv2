"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslationInput } from "@/components/translation/translation-input";
import { TranslationOutput } from "@/components/translation/translation-output";
import { TranslationOptions } from "@/components/translation/translation-options";
import { useTheme } from "next-themes";
import {
  translateText,
  TranslationResult,
  getDefaultText,
} from "@/lib/demo-api";
import { useState, useEffect } from "react";
import demoLanguages from "@/data/demo-languages.json";
import demoDialects from "@/data/demo-dialects.json";
import Image from "next/image";

// Define the preferences interface
interface TranslationPreferences {
  sourceLanguage: string;
  targetLanguage: string;
  targetDialect: string;
  speakerPronouns: string;
  listenerPronouns: string;
  formality: string;
  customLanguages: any[];
}

export default function DemoPage() {
  const [mounted, setMounted] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<TranslationPreferences>({
    sourceLanguage: "en",
    targetLanguage: "ja",
    targetDialect: "tokyo",
    speakerPronouns: "none",
    listenerPronouns: "none",
    formality: "casual",
    customLanguages: [],
  });
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setSourceText(getDefaultText(preferences.sourceLanguage));
  }, [preferences.sourceLanguage]);

  const handleTranslate = async () => {
    if (preferences.sourceLanguage === preferences.targetLanguage) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(
        sourceText,
        preferences.sourceLanguage,
        preferences.targetLanguage,
        preferences.formality,
        preferences.targetDialect
      );
      setTranslationResult(result);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchLanguages = () => {
    setPreferences((prev) => ({
      ...prev,
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage,
    }));
    if (translationResult) {
      setSourceText(translationResult.translation);
      setTranslationResult(null);
    }
  };

  if (!mounted) {
    return null;
  }

  // Type-safe dialect access
  const getDialectsForLanguage = (language: string) => {
    const dialectsData = demoDialects.dialects as Record<
      string,
      { code: string; name: string }[]
    >;
    return dialectsData[language] || [];
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {/* <Globe2 className="h-12 w-12 text-primary" /> */}
          <div className=" text-primary">
            {theme && (
              <Image
                src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
                alt="Logo"
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          Try Our Translation Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience AI-powered translations with dialect support, customizable
          formality, and natural speech patterns
        </p>
      </div>

      <Card className="p-4 md:p-6">
        <Tabs defaultValue="translate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="options">Translation Options</TabsTrigger>
          </TabsList>

          <TabsContent value="translate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TranslationInput
                sourceText={sourceText}
                setSourceText={setSourceText}
                sourceLanguage={preferences.sourceLanguage}
                onSourceLanguageChange={(value) =>
                  setPreferences((prev) => ({ ...prev, sourceLanguage: value }))
                }
                onTranslate={handleTranslate}
                isLoading={isLoading}
                languages={demoLanguages.languages}
                targetLanguage={preferences.targetLanguage}
                onSwitch={handleSwitchLanguages}
              />

              <TranslationOutput
                translationResult={translationResult}
                targetLanguage={preferences.targetLanguage}
                onTargetLanguageChange={(value) =>
                  setPreferences((prev) => ({ ...prev, targetLanguage: value }))
                }
                targetDialect={preferences.targetDialect}
                onTargetDialectChange={(value) =>
                  setPreferences((prev) => ({ ...prev, targetDialect: value }))
                }
                languages={demoLanguages.languages}
                dialects={getDialectsForLanguage(preferences.targetLanguage)}
                sourceLanguage={preferences.sourceLanguage}
              />
            </div>
          </TabsContent>

          <TabsContent value="options">
            <TranslationOptions
              preferences={preferences}
              updatePreference={(key, value) =>
                setPreferences((prev) => ({ ...prev, [key]: value }))
              }
              setPreferences={setPreferences}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
