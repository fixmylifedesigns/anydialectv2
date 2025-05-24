"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export function Hero() {
  const { theme } = useTheme();
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        {theme && (
          <Image
            src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
            alt="Logo"
            width={100}
            height={100}
          />
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold">Lingo Translate</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        AI-powered translations with dialect support, customizable formality,
        and natural speech patterns
      </p>
    </div>
  );
}
