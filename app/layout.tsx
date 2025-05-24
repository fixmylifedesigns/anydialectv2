import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { MobileFooter } from '@/components/mobile-footer';
import { FirebaseProvider } from '@/lib/firebase/firebase-provider';
import { StripeProvider } from '@/lib/stripe/stripe-provider';
import { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lingo Translate - AI-Powered Language Translation',
  description: 'Advanced AI translation with dialect support, customizable formality, and natural speech patterns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseProvider>
            <StripeProvider>  <MobileNav />
              <div className="flex min-h-screen">
                <Sidebar className="hidden md:flex" />
              
                <main className="flex-1 overflow-auto pb-16 md:pb-0 md:ml-16">
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </main>
                <MobileFooter />
                <Toaster />
              </div>
            </StripeProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}