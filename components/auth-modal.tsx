"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  Auth,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { toast } = useToast();
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "App";

  const handleGoogleSignIn = async () => {
    if (!auth) return;

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAppleSignIn = async () => {
    if (!auth) return;

    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithPopup(auth, provider);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Sign in to {appName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-center text-muted-foreground">
            Get the full experience with your {appName} account.
          </p>
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full relative"
              onClick={handleGoogleSignIn}
            >
              <span className="absolute left-4">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Continue with Google
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              className="w-full relative"
              onClick={handleAppleSignIn}
            >
              <span className="absolute left-4">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Continue with Apple
            </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
