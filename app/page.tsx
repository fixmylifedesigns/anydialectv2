import { TranslationArea } from "@/components/translation-area";
import { Hero } from "@/components/hero";
// import { Suspense } from "react";
// import { Loading } from "@/components/ui/loading";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* <Suspense fallback={<>Loading....</>}> */}
        <Hero />
        <TranslationArea />
      {/* </Suspense> */}
    </div>
  );
}
