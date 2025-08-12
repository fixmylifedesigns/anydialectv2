"use client";

import { useEffect, useState, ReactNode } from "react";
import { Loading } from "@/components/ui/loading";

/**
 * Shows <Loading /> for at least `minDuration` ms, then renders children.
 */
export function TimedLoader({
  children,
  minDuration = 5000, // 1 second; change to 2000 for 2 s, etc.
}: {
  children: ReactNode;
  minDuration?: number;
}) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowLoader(false), minDuration);
    return () => clearTimeout(id);
  }, [minDuration]);

  return showLoader ? <Loading /> : <>{children}</>;
}
