'use client';

import { useRouter } from 'next/navigation';
import { useFirebase } from '@/lib/firebase/firebase-provider';
import { useStripe } from '@/lib/stripe/stripe-provider';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/mode-toggle';
import { Home, CreditCard, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MobileMenuPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const { customerData } = useStripe();
  const { toast } = useToast();

  const handleManageBilling = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/create-billing-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create billing portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Billing portal error:', error);
      toast({
        title: 'Error',
        description: 'Failed to open billing portal',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.photoURL || undefined} />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => router.push('/')}
        >
          <Home className="h-5 w-5 mr-2" />
          Home
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => router.push('/pricing')}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Subscriptions
        </Button>

        {customerData?.activeSubscription && (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleManageBilling}
          >
            <Settings className="h-5 w-5 mr-2" />
            Manage Billing
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => auth?.signOut()}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>

        <div className="pt-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}