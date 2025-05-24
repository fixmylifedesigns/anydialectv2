"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useTheme } from "next-themes";
import { useFirebase } from "@/lib/firebase/firebase-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function MobileNav() {
  const { user, setShowAuthModal } = useFirebase();
  const router = useRouter();
  const { theme } = useTheme();
  
  return (
    <header className="md:hidden border-b bg-card">
      <div className="container flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center">
          {theme && (
            <Image
              src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Logo"
              width={40}
              height={40}
              // priority
            />
          )}
        </Link>

        {user ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.push("/mobile-menu")}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowAuthModal(true)}
          >
            <LogIn className="h-6 w-6" />
            {/* <Avatar className="h-9 w-9">
              <AvatarFallback>?</AvatarFallback>
            </Avatar> */}
          </Button>
        )}
      </div>
    </header>
  );
}
