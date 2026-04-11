
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


  return (
    <FirebaseAuthContext.Provider value={{ fbUser, loading }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}
