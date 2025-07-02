import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/hero";
import {
  Globe2,
  Languages,
  Settings2,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section className="py-20 px-4 text-center relative overflow-hidden">
        <Hero showText={false} />
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Translation that understands
            <span className="text-primary">context</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Break through language barriers with AI-powered translations that
            capture the true meaning, tone, and cultural nuances of your
            message.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="w-full sm:w-auto">
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Traditional Translators Fall Short
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Languages className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Lost in Translation
              </h3>
              <p className="text-muted-foreground">
                Traditional translators often miss cultural context and nuances,
                leading to awkward or inappropriate translations that don&apos;t
                capture your intended meaning.
              </p>
            </Card>
            <Card className="p-6">
              <Settings2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">One Size Fits None</h3>
              <p className="text-muted-foreground">
                Most translators ignore critical context like pronouns and
                formality levels, resulting in translations that can be too
                casual or overly formal for your situation.
              </p>
            </Card>
            <Card className="p-6">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Cultural Disconnect
              </h3>
              <p className="text-muted-foreground">
                Without understanding cultural context and local dialects,
                translations can miss the mark and fail to resonate with your
                intended audience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Solution: Context-Aware Translation
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Personalized Translations
                </h3>
                <p className="text-muted-foreground">
                  Specify pronouns, formality levels, and cultural context to
                  ensure your message is conveyed exactly as intended,
                  maintaining appropriate respect and familiarity.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-primary" />
                  Dialect Support
                </h3>
                <p className="text-muted-foreground">
                  Choose from a wide range of regional dialects to ensure your
                  translations sound natural and authentic to local speakers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Cultural Awareness
                </h3>
                <p className="text-muted-foreground">
                  Our AI understands cultural nuances and adjusts translations
                  accordingly, helping you avoid cultural faux pas and
                  miscommunications.
                </p>
              </div>
            </div>
            <Card className="p-8 bg-muted/50">
              <div className="space-y-4">
                <h4 className="font-semibold">Example Translation</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    English (Casual):
                  </p>
                  <p>&quot;Hey, how&apos;s it going?&quot;</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Japanese (Formal, Kansai dialect):
                  </p>
                  <p>「お元気でっか？」</p>
                  <p className="text-sm text-muted-foreground">
                    Romanization: O-genki dekka?
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Note: Polite greeting in Kansai dialect, showing appropriate
                    respect while maintaining regional authenticity.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Ready for more accurate, context-aware translations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our beta program and experience the future of language
            translation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Try Demo
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-background text-primary hover:bg-background/90"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
