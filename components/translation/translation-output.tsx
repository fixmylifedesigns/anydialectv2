"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Download, Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslationOutputProps {
  translationResult: {
    translation: string;
    romaji?: string;
    notes?: string;
    audio?: string;
  } | null;
  targetLanguage: string;
  onTargetLanguageChange: (value: string) => void;
  targetDialect: string;
  onTargetDialectChange: (value: string) => void;
  languages: Array<{ code: string; name: string }>;
  dialects: Array<{ code: string; name: string }>;
  sourceLanguage?: string;
  speakerPronouns?: string;
}

export function TranslationOutput({
  translationResult,
  targetLanguage,
  onTargetLanguageChange,
  targetDialect,
  onTargetDialectChange,
  languages,
  dialects,
  sourceLanguage,
  speakerPronouns,
}: TranslationOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const { toast } = useToast();
  const isDemo =
    typeof window !== "undefined" && window.location.pathname === "/demo";

  // Cleanup function for audio resources
  const cleanupAudio = () => {
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudio(null);
    setAudioUrl(null);
  };

  // Clean up audio resources when component unmounts or translation changes
  useEffect(() => {
    return cleanupAudio;
  }, [translationResult, speakerPronouns]);
console.log(speakerPronouns)
  // Handle audio setup when translation result changes
  useEffect(() => {
    cleanupAudio();

    if (!translationResult?.audio) return;

    if (isDemo) {
      const newAudio = new Audio();

      const handleError = () => {
        console.error("Audio loading error");
        toast({
          title: "Error",
          description: "Failed to load audio",
          variant: "destructive",
        });
      };

      newAudio.addEventListener("error", handleError);
      newAudio.src = translationResult.audio;
      setAudio(newAudio);

      return () => {
        newAudio.removeEventListener("error", handleError);
        cleanupAudio();
      };
    }
  }, [translationResult?.audio, isDemo, toast]);

  const handleCopyText = async () => {
    if (!translationResult?.translation) return;

    try {
      await navigator.clipboard.writeText(translationResult.translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Translation copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handlePlayAudio = async () => {
    if (!translationResult?.translation) return;

    if (isDemo) {
      if (audio) {
        try {
          audio.currentTime = 0;
          await audio.play();
        } catch (error) {
          console.error("Demo audio playback error:", error);
          toast({
            title: "Error",
            description: "Failed to play audio",
            variant: "destructive",
          });
        }
      }
      return;
    }

    if (audio && audioUrl) {
      audio.currentTime = 0;
      audio.play();
      return;
    }

    setIsLoadingAudio(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translationResult.translation,
          language: targetLanguage,
          speakerPronouns: speakerPronouns,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const newAudio = new Audio(url);
      setAudio(newAudio);
      await newAudio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleDownloadAudio = () => {
    if (!translationResult?.translation) return;

    if (isDemo && translationResult?.audio) {
      const link = document.createElement("a");
      link.href = translationResult.audio;
      link.download = "translation.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "translation.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={targetLanguage}
          onValueChange={onTargetLanguageChange}
          disabled={targetLanguage === sourceLanguage}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                disabled={lang.code === sourceLanguage}
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {dialects.length > 0 && (
          <Select value={targetDialect} onValueChange={onTargetDialectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select dialect" />
            </SelectTrigger>
            <SelectContent>
              {dialects.map((dialect) => (
                <SelectItem key={dialect.code} value={dialect.code}>
                  {dialect.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Translation"
          value={translationResult?.translation || ""}
          readOnly
          className="min-h-[200px]"
        />
        {translationResult?.romaji && (
          <div className="text-sm text-muted-foreground">
            {translationResult.romaji}
          </div>
        )}
        {translationResult?.notes && (
          <div className="text-sm text-muted-foreground italic">
            {translationResult.notes}
          </div>
        )}
        <div className="flex justify-end gap-2">
          {(translationResult?.audio || !isDemo) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayAudio}
              disabled={isLoadingAudio || !translationResult?.translation}
            >
              {isLoadingAudio ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyText}
            disabled={!translationResult?.translation}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          {((isDemo && translationResult?.audio) || audioUrl) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownloadAudio}
              disabled={!translationResult?.translation}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
