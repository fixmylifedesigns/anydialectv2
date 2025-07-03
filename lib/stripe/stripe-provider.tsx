"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useFirebase } from "@/lib/firebase/firebase-provider";
import { useToast } from "@/hooks/use-toast";

interface StripeCustomerData {
  exists: boolean;
  customer?: any;
  activeSubscription?: any;
}

interface StripeContextType {
  customerData: StripeCustomerData | null;
  isLoading: boolean;
  refetchCustomer: () => Promise<void>;
  updateCustomer: (data: StripeCustomerData) => void;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [customerData, setCustomerData] = useState<StripeCustomerData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useFirebase();
  const { toast } = useToast();

  const updateCustomer = (data: StripeCustomerData) => setCustomerData(data);
  const fetchCustomerData = async (email: string) => {
    try {
      const response = await fetch("/api/check-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription data",
        variant: "destructive",
      });
    }
  };

  const refetchCustomer = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    await fetchCustomerData(user.email);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.email) {
      setIsLoading(true);
      fetchCustomerData(user.email).finally(() => {
        setIsLoading(false);
      });
    } else {
      setCustomerData(null);
    }
  }, [user?.email]);

  return (
    <StripeContext.Provider
      value={{ customerData, isLoading, refetchCustomer, updateCustomer }}
    >
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error("useStripe must be used within a StripeProvider");
  }
  return context;
}
