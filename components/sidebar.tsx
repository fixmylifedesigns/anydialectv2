"use client";

import {
  Globe2,
  Home,
  CreditCard,
  Settings,
  FileText,
  LogIn,
} from "lucide-react";
import { useFirebase } from "@/lib/firebase/firebase-provider";
import { useStripe } from "@/lib/stripe/stripe-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = "" }: SidebarProps) {
  const { user, setShowAuthModal } = useFirebase();
  const { customerData } = useStripe();
  const router = useRouter();
  const { theme } = useTheme();

  const handleManageBilling = async () => {
    if (!user?.email) {
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
    }
  };

  const handleSignOut = async () => {
    await auth?.signOut();
    router.refresh();
  };
console.log(theme)
  return (
    <div
      className={`fixed left-0 top-0 flex h-screen w-16 flex-col border-r bg-card ${className}`}
    >
      <div className="p-3">
        <Link href="/" className="flex items-center justify-center">
          {theme && (
            <Image
              src={theme === "dark" || theme === "system"  ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Logo"
              width={60}
              height={60}
              priority
            />
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {/* <nav className="flex flex-col items-center space-y-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/pricing" passHref>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <CreditCard className="h-5 w-5" />
            </Button>
          </Link>
          {user && customerData?.activeSubscription && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleManageBilling}
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </nav> */}
      </div>

      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              {user ? (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <LogIn className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user ? (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/pricing")}>
                  Subscriptions
                </DropdownMenuItem>
                {customerData?.activeSubscription && (
                  <DropdownMenuItem onClick={handleManageBilling}>
                    Manage Billing
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/terms")}>
                  Terms of Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/privacy")}>
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ModeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => router.push("/pricing")}>
                  Subscriptions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/terms")}>
                  Terms of Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/privacy")}>
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ModeToggle />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAuthModal(true)}>
                  Sign In
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
