'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from './config';
import { AuthModal } from '@/components/auth-modal';

type FirebaseContextType = {
  user: User | null;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if auth is available before using it
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    showAuthModal,
    setShowAuthModal
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}