'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomTooltip } from '@/components/ui/custom-tooltip';
import availableLanguages from '@/data/available-languages.json';
import dialects from '@/data/dialects.json';

interface TranslationPreferences {
  sourceLanguage: string;
  targetLanguage: string;
  targetDialect: string;
  speakerPronouns: string;
  listenerPronouns: string;
  formality: string;
  customLanguages: {
    name: string;
    code: string;
    dialects: { name: string; code: string; }[];
  }[];
}

interface TranslationOptionsProps {
  preferences: TranslationPreferences;
  updatePreference: (key: keyof TranslationPreferences, value: string) => void;
  setPreferences: React.Dispatch<React.SetStateAction<TranslationPreferences>>;
}

export function TranslationOptions({
  preferences,
  updatePreference,
  setPreferences,
}: TranslationOptionsProps) {
  const [newLanguage, setNewLanguage] = useState({ name: '' });
  const [newDialect, setNewDialect] = useState({ name: '' });
  const [selectedCustomLanguage, setSelectedCustomLanguage] = useState<string | null>(null);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const { toast } = useToast();

  // Check if we're in demo mode
  const isDemo = typeof window !== 'undefined' && window.location.pathname === '/demo';
  const hasKlingon = preferences.customLanguages.some(lang => lang.name === 'Klingon');

  // Set Klingon as default new language in demo mode if not already added
  useEffect(() => {
    if (isDemo && !hasKlingon) {
      setNewLanguage({ name: 'Klingon' });
    } else {
      setNewLanguage({ name: '' });
    }
  }, [isDemo, hasKlingon]);

  const handleAddCustomLanguage = () => {
    if (!newLanguage.name) {
      toast({
        title: 'Error',
        description: 'Please enter a language name',
        variant: 'destructive',
      });
      return;
    }

    setPreferences(prev => ({
      ...prev,
      customLanguages: [
        ...prev.customLanguages,
        { name: newLanguage.name, code: newLanguage.name, dialects: [] },
      ],
    }));
    setNewLanguage({ name: '' });
  };

  const handleAddCustomDialect = () => {
    if (!selectedCustomLanguage || !newDialect.name) {
      toast({
        title: 'Error',
        description: 'Please enter a dialect name',
        variant: 'destructive',
      });
      return;
    }

    setPreferences(prev => ({
      ...prev,
      customLanguages: prev.customLanguages.map(lang =>
        lang.code === selectedCustomLanguage
          ? {
              ...lang,
              dialects: [...lang.dialects, { name: newDialect.name, code: newDialect.name }],
            }
          : lang
      ),
    }));
    setNewDialect({ name: '' });
  };

  const handleRemoveCustomLanguage = (code: string) => {
    setPreferences(prev => ({
      ...prev,
      customLanguages: prev.customLanguages.filter(lang => lang.code !== code),
    }));
    if (selectedCustomLanguage === code) {
      setSelectedCustomLanguage(null);
    }
  };

  const handleRemoveCustomDialect = (languageCode: string, dialectCode: string) => {
    setPreferences(prev => ({
      ...prev,
      customLanguages: prev.customLanguages.map(lang =>
        lang.code === languageCode
          ? {
              ...lang,
              dialects: lang.dialects.filter(d => d.code !== dialectCode),
            }
          : lang
      ),
    }));
  };

  const allLanguages = [
    ...availableLanguages.languages,
    ...preferences.customLanguages,
  ];

  const getAvailableDialects = () => {
    const builtInDialects = dialects.dialects[preferences.targetLanguage as keyof typeof dialects.dialects] || [];
    const customLanguage = preferences.customLanguages.find(lang => lang.code === preferences.targetLanguage);
    const customDialects = customLanguage?.dialects || [];
    return [...builtInDialects, ...customDialects];
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Language Settings */}
        <div className="space-y-4">
          <CustomTooltip content="Select the source language you're writing in and the target language you want to translate to. For example, if you're writing in English and need to translate to Japanese, select English as source and Japanese as target.">
            <h3 className="text-lg font-medium">Language Settings</h3>
          </CustomTooltip>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Language</label>
              <Select
                value={preferences.sourceLanguage}
                onValueChange={value => updatePreference('sourceLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {allLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Language</label>
              <div className="flex gap-2">
                <Select
                  value={preferences.targetLanguage}
                  onValueChange={value => updatePreference('targetLanguage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLanguages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getAvailableDialects().length > 0 && (
                  <Select
                    value={preferences.targetDialect}
                    onValueChange={value => updatePreference('targetDialect', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dialect" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDialects().map(dialect => (
                        <SelectItem key={dialect.code} value={dialect.code}>
                          {dialect.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Other Settings */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <CustomTooltip content="Set pronouns for the speaker (you) to ensure accurate translations in languages where pronouns affect speech patterns and formality levels.">
                <h3 className="text-lg font-medium">Speaker Settings</h3>
              </CustomTooltip>
              <Select
                value={preferences.speakerPronouns}
                onValueChange={value => updatePreference('speakerPronouns', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Speaker pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No pronouns</SelectItem>
                  <SelectItem value="he/him" disabled={isDemo}>He/Him</SelectItem>
                  <SelectItem value="she/her" disabled={isDemo}>She/Her</SelectItem>
                  <SelectItem value="they/them" disabled={isDemo}>They/Them</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <CustomTooltip content="Set pronouns for the person you're speaking to, which helps maintain appropriate levels of respect and formality in languages where this matters.">
                <h3 className="text-lg font-medium">Listener Settings</h3>
              </CustomTooltip>
              <Select
                value={preferences.listenerPronouns}
                onValueChange={value => updatePreference('listenerPronouns', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Listener pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No pronouns</SelectItem>
                  <SelectItem value="he/him" disabled={isDemo}>He/Him</SelectItem>
                  <SelectItem value="she/her" disabled={isDemo}>She/Her</SelectItem>
                  <SelectItem value="they/them" disabled={isDemo}>They/Them</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <CustomTooltip content="Choose the tone of your translation. Formal for business or strangers, casual for friends, or friendly for close relationships. This helps make your translations sound more natural and appropriate for the context.">
                <h3 className="text-lg font-medium">Style Settings</h3>
              </CustomTooltip>
              <Select
                value={preferences.formality}
                onValueChange={value => updatePreference('formality', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Formality level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No formality</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly" disabled={isDemo}>Friendly</SelectItem>
                  <SelectItem value="child" disabled={isDemo}>Child</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Custom Language Settings */}
      <div className="border-t pt-6">
        <CustomTooltip content="Add your own languages and dialects, including fictional ones! This is a prototype feature - translations may not always be accurate but it's perfect for experimenting with custom or constructed languages.">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowCustomSettings(!showCustomSettings)}
          >
            <span>Custom Language Settings (Beta)</span>
            {showCustomSettings ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CustomTooltip>

        {showCustomSettings && (
          <div className="mt-4 space-y-4 border rounded-lg p-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Add New Language</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Language name (e.g., Klingon)"
                  value={newLanguage.name}
                  onChange={e => setNewLanguage({ name: e.target.value })}
                  disabled={isDemo && hasKlingon}
                />
                <Button 
                  onClick={handleAddCustomLanguage} 
                  size="icon"
                  disabled={isDemo && hasKlingon}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {preferences.customLanguages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Custom Languages</h4>
                <div className="space-y-2">
                  {preferences.customLanguages.map(lang => (
                    <div key={lang.code} className="flex items-start gap-2">
                      <div className="flex-1 space-y-2 border rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lang.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCustomLanguage(lang.code)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {selectedCustomLanguage === lang.code && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Dialect name"
                                value={newDialect.name}
                                onChange={e => setNewDialect({ name: e.target.value })}
                                disabled={isDemo && hasKlingon}
                              />
                              <Button 
                                onClick={handleAddCustomDialect} 
                                size="icon"
                                disabled={isDemo && hasKlingon}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {lang.dialects.map(dialect => (
                              <div
                                key={dialect.code}
                                className="flex items-center justify-between text-sm pl-4"
                              >
                                <span>{dialect.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveCustomDialect(lang.code, dialect.code)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() =>
                            setSelectedCustomLanguage(
                              selectedCustomLanguage === lang.code ? null : lang.code
                            )
                          }
                        >
                          {selectedCustomLanguage === lang.code
                            ? 'Hide Dialects'
                            : 'Add Dialects'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}