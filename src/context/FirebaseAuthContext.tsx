"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { signInWithCustomToken, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';

const FirebaseAuthContext = createContext<{ fbUser: User | null; loading: boolean }>({
  fbUser: null,
  loading: true,
});

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase client auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // On mount, fetch custom token from server and sign in client SDK
    const syncAuth = async () => {
      try {
        const res = await fetch('/api/auth/custom-token');
        const { customToken } = await res.json();
        if (customToken) {
          await signInWithCustomToken(auth, customToken);
        } else {
          // No session - make sure Firebase client is also signed out
          await firebaseSignOut(auth).catch(() => {});
        }
      } catch (err) {
        console.warn('[FirebaseAuthProvider] Could not sync auth:', err);
      }
    };
    syncAuth();
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ fbUser, loading }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}
