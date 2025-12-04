'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  githubToken: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signInWithGithub: () => Promise<{ error: Error | null }>;
  connectGithubForDeploy: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log('Supabase signUp response:', {
      hasUser: !!data.user,
      hasSession: !!data.session,
      userConfirmedAt: data.user?.confirmed_at,
      error: error?.message,
    });

    // Check if email confirmation is required
    const needsEmailConfirmation = !error && data.user && !data.session;

    // If signup succeeded and we have a user, ensure profile exists
    if (!error && data.user) {
      // Try to create profile (will fail silently if trigger already created it)
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: data.user.email,
        },
        { onConflict: 'id' }
      );
    }

    return { error: error as Error | null, needsEmailConfirmation: !!needsEmailConfirmation };
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo',
      },
    });
    return { error: error as Error | null };
  };

  // Connect GitHub with repo scope for deployment (for users who signed up with email)
  const connectGithubForDeploy = async () => {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        scopes: 'repo',
      },
    });
    return { error: error as Error | null };
  };

  // Get GitHub token from session
  const githubToken = session?.provider_token ?? null;

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        githubToken,
        signInWithEmail,
        signUpWithEmail,
        signInWithGithub,
        connectGithubForDeploy,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
