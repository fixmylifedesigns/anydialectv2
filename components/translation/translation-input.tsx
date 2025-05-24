'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Clipboard, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationInputProps {
  sourceText: string;
  setSourceText: (text: string) => void;
  sourceLanguage: string;
  onSourceLanguageChange: (value: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  languages: Array<{ code: string; name: string; }>;
  targetLanguage?: string;
  onSwitch?: () => void;
}

export function TranslationInput({
  sourceText,
  setSourceText,
  sourceLanguage,
  onSourceLanguageChange,
  onTranslate,
  isLoading,
  languages,
  targetLanguage,
  onSwitch
}: TranslationInputProps) {
  const [isSourceCopied, setIsSourceCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopySourceText = async () => {
    if (!sourceText) return;

    try {
      await navigator.clipboard.writeText(sourceText);
      setIsSourceCopied(true);
      setTimeout(() => setIsSourceCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSourceText(text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to paste text",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select 
          value={sourceLanguage} 
          onValueChange={onSourceLanguageChange}
          disabled={sourceLanguage === targetLanguage}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                disabled={lang.code === targetLanguage}
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onSwitch && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSwitch}
            className="shrink-0"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Enter text to translate"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className="min-h-[200px]"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePasteText}
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopySourceText}
            disabled={!sourceText}
          >
            {isSourceCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={onTranslate} disabled={isLoading || sourceLanguage === targetLanguage}>
            {isLoading ? 'Translating...' : 'Translate'}
          </Button>
        </div>
      </div>
    </div>
  );
}