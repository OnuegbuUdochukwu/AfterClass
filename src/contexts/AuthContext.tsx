"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Instantiate browser client
  const supabase = createClient();

  useEffect(() => {
    const handleSession = async (currentSession: Session | null) => {
      const allowedDomain = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN;
      
      if (currentSession?.user?.email && allowedDomain) {
        if (!currentSession.user.email.endsWith(`@${allowedDomain}`)) {
          console.warn(`User email does not match allowed domain: ${allowedDomain}. Signing out.`);
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setIsLoading(false);
          return;
        }
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, supabase.auth.signOut]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
