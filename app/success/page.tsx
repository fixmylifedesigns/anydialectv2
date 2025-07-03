"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/hero";
import { CheckCircle2 } from "lucide-react";
import { useStripe } from "@/lib/stripe/stripe-provider";

/**
 * Thank‑you page shown after a successful subscription.
 * It triggers a fresh customer lookup so the UI has the
 * latest subscription status without requiring a full reload.
 */
export default function ThankYouPage() {
  const { refetchCustomer, isLoading, customerData } = useStripe();
  const router = useRouter();

  // On first mount, pull the latest Stripe data.
  useEffect(() => {
    (async () => {
      await refetchCustomer();
      // If the user landed here directly after checkout and
      // the subscription hasn’t propagated yet, poll once more
      // after a short delay. This avoids a manual full refresh.
      if (!customerData?.activeSubscription) {
        const timeout = setTimeout(refetchCustomer, 4000);
        return () => clearTimeout(timeout);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Optional: react‑server refresh once we know data is ready.
  useEffect(() => {
    if (customerData?.activeSubscription) {
      router.refresh?.();
    }
    console.log("Customer data:", customerData);
  }, [customerData?.activeSubscription, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative overflow-hidden flex-grow flex items-center justify-center py-20 px-4 text-center">
        <div className="relative z-10 container mx-auto max-w-xl space-y-6">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Subscription confirmed
          </h1>
          <p className="text-lg text-muted-foreground pb-10">
            {isLoading
              ? "Checking your subscription details..."
              : "Your subscription was processed successfully. You can start using Lingo Translate right away."}
          </p>
          <Link href="/">
            <Button size="lg" className="mx-auto" disabled={isLoading}>
              Start Lingo Translate
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
