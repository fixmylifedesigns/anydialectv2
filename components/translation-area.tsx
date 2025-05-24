'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/lib/firebase/firebase-provider';
import { useStripe } from '@/lib/stripe/stripe-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { TranslationInput } from '@/components/translation/translation-input';
import { TranslationOutput } from '@/components/translation/translation-output';
import { TranslationOptions } from '@/components/translation/translation-options';
import availableLanguages from '@/data/available-languages.json';
import dialects from '@/data/dialects.json';

interface TranslationResponse {
  translation: string;
  romaji?: string;
  detectedSpeakerPronouns?: string;
  detectedListenerPronouns?: string;
  formalityUsed?: string;
  notes?: string;
}

interface TranslationPreferences {
  sourceLanguage: string;
  targetLanguage: string;
  targetDialect: string;
  speakerPronouns: string;
  listenerPronouns: string;
  formality: string;
  customLanguages: {
    code: string;
    name: string;
    dialects: { code: string; name: string; }[];
  }[];
}

const defaultPreferences: TranslationPreferences = {
  sourceLanguage: 'en',
  targetLanguage: 'ja',
  targetDialect: 'standard',
  speakerPronouns: 'none',
  listenerPronouns: 'none',
  formality: 'none',
  customLanguages: [],
};

function loadPreferences(): TranslationPreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  
  const saved = localStorage.getItem('translationPreferences');
  if (!saved) return defaultPreferences;
  
  try {
    const parsed = JSON.parse(saved);
    return {
      ...defaultPreferences,
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to parse saved preferences:', e);
    return defaultPreferences;
  }
}

export function TranslationArea() {
  const [sourceText, setSourceText] = useState('');
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const [preferences, setPreferences] = useState<TranslationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { user, setShowAuthModal } = useFirebase();
  const { customerData } = useStripe();
  const { toast } = useToast();
  const router = useRouter();

  const allLanguages = [
    ...availableLanguages.languages,
    ...preferences.customLanguages.map(lang => ({
      code: lang.code,
      name: lang.name,
      romaji: ''
    }))
  ];

  const getAvailableDialects = () => {
    const builtInDialects = dialects.dialects[preferences.targetLanguage as keyof typeof dialects.dialects] || [];
    const customLanguage = preferences.customLanguages.find(lang => lang.code === preferences.targetLanguage);
    const customDialects = customLanguage?.dialects || [];
    return [...builtInDialects, ...customDialects];
  };

  useEffect(() => {
    const savedPreferences = loadPreferences();
    setPreferences(savedPreferences);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('translationPreferences', JSON.stringify(preferences));
  }, [preferences, isInitialized]);

  useEffect(() => {
    setTranslationResult(null);
  }, [preferences.sourceLanguage, preferences.targetLanguage, preferences.targetDialect]);

  const updatePreference = (key: keyof TranslationPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleTranslate = async () => {
    const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    
    if (!devMode) {
      if (!user) {
        setShowAuthModal(true);
        return;
      }

      if (!customerData?.activeSubscription) {
        router.push('/pricing');
        return;
      }
    }

    if (!sourceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        text: sourceText,
        sourceLanguage: preferences.sourceLanguage,
        targetLanguage: preferences.targetLanguage,
        targetDialect: getAvailableDialects().length > 0 ? preferences.targetDialect : undefined,
        speakerPronouns: preferences.speakerPronouns === 'none' ? undefined : preferences.speakerPronouns,
        listenerPronouns: preferences.listenerPronouns === 'none' ? undefined : preferences.listenerPronouns,
        formality: preferences.formality === 'none' ? undefined : preferences.formality,
      };

      const apiUrl = process.env.NEXT_PUBLIC_TRANSLATION_API_URL || 'https://translate.minnastudy.com/api/translate';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Server returned ${response.status}: ${response.statusText}`
        }));
        throw new Error(errorData.message || 'Translation request failed');
      }

      const data: TranslationResponse = await response.json();
      setTranslationResult(data);
      
      if (data.notes) {
        toast({
          title: "Translation complete",
          description: data.notes,
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed",
        description: error instanceof Error 
          ? error.message 
          : "Unable to connect to translation service. Please try again later.",
        variant: "destructive",
      });
      setTranslationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchLanguages = () => {
    setPreferences(prev => ({
      ...prev,
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage
    }));
    if (translationResult) {
      setSourceText(translationResult.translation);
      setTranslationResult(null);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
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
              onSourceLanguageChange={(value) => updatePreference('sourceLanguage', value)}
              onTranslate={handleTranslate}
              isLoading={isLoading}
              languages={allLanguages}
              targetLanguage={preferences.targetLanguage}
              onSwitch={handleSwitchLanguages}
            />

            <TranslationOutput
              translationResult={translationResult}
              targetLanguage={preferences.targetLanguage}
              onTargetLanguageChange={(value) => updatePreference('targetLanguage', value)}
              targetDialect={preferences.targetDialect}
              onTargetDialectChange={(value) => updatePreference('targetDialect', value)}
              languages={allLanguages}
              dialects={getAvailableDialects()}
              sourceLanguage={preferences.sourceLanguage}
            />
          </div>
        </TabsContent>

        <TabsContent value="options">
          <TranslationOptions
            preferences={preferences}
            updatePreference={updatePreference}
            setPreferences={setPreferences}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}