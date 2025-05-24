"use client";

import Link from "next/link";
import { useFirebase } from "@/lib/firebase/firebase-provider";
import { FileText, CreditCard } from "lucide-react";

export function MobileFooter() {
  const { user } = useFirebase();

  if (user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="grid grid-cols-3 gap-1 p-2">
        <Link
          href="/terms"
          className="flex flex-col items-center justify-center p-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <FileText className="h-5 w-5 mb-1" />
          Terms
        </Link>
        <Link
          href="/pricing"
          className="flex flex-col items-center justify-center p-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <CreditCard className="h-5 w-5 mb-1" />
          Pricing
        </Link>
        <Link
          href="/privacy"
          className="flex flex-col items-center justify-center p-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <FileText className="h-5 w-5 mb-1" />
          Privacy
        </Link>
      </div>
    </div>
  );
}
