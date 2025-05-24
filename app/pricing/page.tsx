"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Zap, CreditCard } from "lucide-react";
import { useFirebase } from "@/lib/firebase/firebase-provider";
import { useStripe } from "@/lib/stripe/stripe-provider";
import { useToast } from "@/hooks/use-toast";
import pricing from "@/data/pricing.json";

const icons = {
  star: Star,
  shield: Shield,
  zap: Zap,
};

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const { user, setShowAuthModal } = useFirebase();
  const { customerData, isLoading } = useStripe();
  const { toast } = useToast();

  const handleManageBilling = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Please sign in to manage billing",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/create-billing-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create billing portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Billing portal error:", error);
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = async (tier: (typeof pricing.tiers)[0]) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const priceId =
        billingInterval === "yearly"
          ? tier.priceId.yearly
          : tier.priceId.monthly;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          email: user.email,
          interval: billingInterval,
          mode: tier.oneTime ? "payment" : "subscription",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16 relative">
        {customerData?.activeSubscription && (
          <div className="justify-end flex right-0 top-0">
            <Button
              onClick={handleManageBilling}
              variant="outline"
              className="items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Manage Billing
            </Button>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">Choose your plan</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Start with our special beta pricing and lock in your rate forever
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={billingInterval === "monthly" ? "default" : "outline"}
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly billing
          </Button>
          <Button
            variant={billingInterval === "yearly" ? "default" : "outline"}
            onClick={() => setBillingInterval("yearly")}
          >
            Yearly billing
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {pricing.tiers.map((tier) => {
          const Icon = icons[tier.iconType as keyof typeof icons];
          const price =
            billingInterval === "yearly"
              ? tier.yearlyPrice ||
                (tier.monthlyPrice ? tier.monthlyPrice * 12 * 0.8 : 0)
              : tier.monthlyPrice || 0;

          const tierPriceId =
            billingInterval === "yearly"
              ? tier.priceId.yearly
              : tier.priceId.monthly;
          const isCurrentPlan =
            customerData?.activeSubscription?.items.data[0]?.price.id ===
            tierPriceId;

          return (
            <Card
              key={tier.name}
              className={`p-6 ${
                tier.highlighted
                  ? "border-primary shadow-lg relative overflow-hidden"
                  : ""
              }`}
            >
              {tier.badge && (
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {tier.badge}
                </Badge>
              )}
              <div className="flex items-center gap-2 mb-4">
                {Icon && <Icon className="h-5 w-5 text-primary" />}
                <h3 className="text-2xl font-bold">{tier.name}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{tier.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${price}</span>
                {!tier.oneTime && (
                  <span className="text-muted-foreground">
                    /{billingInterval}
                  </span>
                )}
              </div>
              {tier.limitedSpots && (
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.limitedSpots}
                </p>
              )}
              <Button
                className="w-full mb-6"
                variant={tier.highlighted ? "default" : "outline"}
                onClick={() => handleSubscribe(tier)}
                disabled={!tier.active || isCurrentPlan || isLoading}
              >
                {isCurrentPlan ? "Current Plan" : tier.ctaText}
              </Button>
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
