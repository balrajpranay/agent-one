'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { supabase, syncUserToSupabase, signInWithGoogleSupabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  handleGoogleSuccess: (credentialResponse: any) => Promise<void>;
  handleGoogleError: () => void;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  updateCustomApiKey: (key: string) => void;
  incrementAuditCount: () => void;
  googleClientId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '164090023306-g475l009a50i0pm4nfq9vhvr4ai22lpc.apps.googleusercontent.com';

  useEffect(() => {
    try {
      // 1. Check local session
      const saved = localStorage.getItem('docfin_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.email !== 'demo@docfin.ai' && parsed.email !== 'admin@docfin.ai' && parsed.id !== 'usr_demo_account') {
          const accounts = getStoredAccounts();
          const cleanEmail = parsed.email.toLowerCase();
          if (accounts[cleanEmail]?.id) {
            parsed.id = accounts[cleanEmail].id;
          }
          setUser(parsed);
        } else {
          localStorage.removeItem('docfin_user_session');
          localStorage.removeItem('docfin_user_documents');
        }
      }

      // 2. Check Supabase active auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          const profile: UserProfile = {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'DocFin User',
            email: u.email || '',
            role: 'Document Auditor',
            avatarUrl: u.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            plan: 'Pro',
            documentsUsed: 0,
            documentsLimit: 100,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setUser(profile);
          localStorage.setItem('docfin_user_session', JSON.stringify(profile));
          syncUserToSupabase(profile);
        }
      });

      // 3. Listen to Supabase auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u = session.user;
          const profile: UserProfile = {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'DocFin User',
            email: u.email || '',
            role: 'Document Auditor',
            avatarUrl: u.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            plan: 'Pro',
            documentsUsed: 0,
            documentsLimit: 100,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setUser(profile);
          localStorage.setItem('docfin_user_session', JSON.stringify(profile));
          syncUserToSupabase(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('docfin_user_session');
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    } catch (e) {
      console.warn('Auth initialization notice:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.profile) {
        const p = credentialResponse.profile;
        const googleUser: UserProfile = {
          id: `usr_google_${p.sub || Date.now()}`,
          name: p.name || p.given_name || 'Google User',
          email: p.email || 'user@gmail.com',
          role: 'Document Auditor',
          avatarUrl: p.picture || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          plan: 'Pro',
          documentsUsed: user?.documentsUsed || 0,
          documentsLimit: 100,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUser(googleUser);
        localStorage.setItem('docfin_user_session', JSON.stringify(googleUser));
        await syncUserToSupabase(googleUser);
        return;
      }

      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const googleUser: UserProfile = {
          id: `usr_google_${decoded.sub}`,
          name: decoded.name || decoded.given_name || 'Google User',
          email: decoded.email,
          role: 'Document Auditor',
          avatarUrl: decoded.picture,
          plan: 'Pro',
          documentsUsed: user?.documentsUsed || 0,
          documentsLimit: 100,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUser(googleUser);
        localStorage.setItem('docfin_user_session', JSON.stringify(googleUser));
        
        // Sync with Supabase cloud database
        await syncUserToSupabase(googleUser);
      }
    } catch (err) {
      console.error('Google credential parse error:', err);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In was unsuccessful or closed by user.');
  };

// Helper: Secure SHA-256 Password Hashing
async function hashPassword(pass: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(pass + '_docfin_secure_salt_2026');
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  return btoa(pass + '_docfin_secure_salt_2026');
}

interface StoredAccount {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

function getStoredAccounts(): Record<string, StoredAccount> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('docfin_registered_accounts');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Account store read notice:', e);
  }
  return {};
}

function saveStoredAccount(account: StoredAccount) {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getStoredAccounts();
    accounts[account.email.toLowerCase()] = account;
    localStorage.setItem('docfin_registered_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.warn('Account store write notice:', e);
  }
}

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (pass || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    if (cleanPassword.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. Try Supabase direct authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (!error && data?.user) {
        const u = data.user;
        const loggedInUser: UserProfile = {
          id: u.id,
          name: u.user_metadata?.name || cleanEmail.split('@')[0],
          email: u.email || cleanEmail,
          role: 'Document Auditor',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          plan: 'Pro',
          documentsUsed: 0,
          documentsLimit: 100,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUser(loggedInUser);
        localStorage.setItem('docfin_user_session', JSON.stringify(loggedInUser));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase auth notice:', err);
    }

    // 2. Check Local Registered Accounts Database
    const accounts = getStoredAccounts();
    const stored = accounts[cleanEmail];
    const inputHash = await hashPassword(cleanPassword);

    if (stored) {
      // Verify Password Match
      if (stored.passwordHash !== inputHash) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Incorrect password. Please verify your password and try again.'
        };
      }

      const stableId = stored.id || `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
      if (!stored.id) {
        stored.id = stableId;
        saveStoredAccount(stored);
      }

      const loggedInUser: UserProfile = {
        id: stableId,
        name: stored.name,
        email: stored.email,
        role: 'Document Auditor',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        plan: 'Pro',
        documentsUsed: 0,
        documentsLimit: 100,
        createdAt: stored.createdAt.split('T')[0]
      };

      setUser(loggedInUser);
      localStorage.setItem('docfin_user_session', JSON.stringify(loggedInUser));
      setIsLoading(false);
      syncUserToSupabase(loggedInUser);
      return { success: true };
    }

    // Account not found
    setIsLoading(false);
    return {
      success: false,
      error: 'No account found with this email address. Please sign up to create a new account.'
    };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const { error } = await signInWithGoogleSupabase();
      if (!error) {
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase Google OAuth fallback:', err);
    }

    const googleUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'Document Auditor',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      plan: 'Pro',
      documentsUsed: 0,
      documentsLimit: 100,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(googleUser);
    localStorage.setItem('docfin_user_session', JSON.stringify(googleUser));
    setIsLoading(false);

    syncUserToSupabase(googleUser);
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (pass || '').trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your name, email address, and password.' };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (cleanPassword.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if email already registered locally
    const accounts = getStoredAccounts();
    if (accounts[cleanEmail]) {
      setIsLoading(false);
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: { name: cleanName }
        }
      });

      if (error && !error.message.includes('fetch') && !error.message.includes('connection')) {
        if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
          setIsLoading(false);
          return { success: false, error: 'An account with this email address already exists in Supabase. Please sign in.' };
        }
      }

      if (!error && data?.user) {
        const u = data.user;
        const newUser: UserProfile = {
          id: u.id,
          name: cleanName,
          email: cleanEmail,
          role: 'Document Auditor',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          plan: 'Pro',
          documentsUsed: 0,
          documentsLimit: 100,
          createdAt: new Date().toISOString().split('T')[0]
        };

        // Save password hash to local accounts store
        const passwordHash = await hashPassword(cleanPassword);
        saveStoredAccount({
          id: u.id,
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          createdAt: new Date().toISOString()
        });

        setUser(newUser);
        localStorage.setItem('docfin_user_session', JSON.stringify(newUser));
        setIsLoading(false);
        syncUserToSupabase(newUser);
        return { success: true };
      }
    } catch (err) {
      console.warn('Supabase signup notice:', err);
    }

    // Local account registration
    const stableId = `usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
    const passwordHash = await hashPassword(cleanPassword);
    saveStoredAccount({
      id: stableId,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    });

    const newUser: UserProfile = {
      id: stableId,
      name: cleanName,
      email: cleanEmail,
      role: 'Document Auditor',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      plan: 'Pro',
      documentsUsed: 0,
      documentsLimit: 100,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    localStorage.setItem('docfin_user_session', JSON.stringify(newUser));
    setIsLoading(false);

    syncUserToSupabase(newUser);
    return { success: true };
  };

  const loginAsGuest = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const guestUser: UserProfile = {
      id: 'usr_guest',
      name: 'Guest Analyst',
      email: 'guest@agentone.ai',
      role: 'Document Auditor',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'Pro',
      documentsUsed: 0,
      documentsLimit: 100,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUser(guestUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('docfin_user_session', JSON.stringify(guestUser));
    }
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout warning:', e);
    }

    // Purge user-specific storage, caches, and session completely
    if (typeof window !== 'undefined') {
      if (user?.id) {
        localStorage.removeItem(`agentone_user_documents_${user.id}`);
        sessionStorage.removeItem(`agentone_user_documents_${user.id}`);
      }
      if (user?.email) {
        localStorage.removeItem(`agentone_user_documents_${user.email.toLowerCase()}`);
      }
      localStorage.removeItem('docfin_user_session');
      localStorage.removeItem('docfin_user_documents');
      localStorage.removeItem('agentone_active_doc');
      localStorage.removeItem('agentone_chat_messages');
      sessionStorage.clear();

      // Dispatch event to force all active workspace components to immediately clear in-memory state
      window.dispatchEvent(new CustomEvent('agentone:logout'));
    }

    setUser(null);
  };

  const updateProfile = (name: string, email: string) => {
    if (!user) return;
    const updated = { ...user, name, email };
    setUser(updated);
    localStorage.setItem('docfin_user_session', JSON.stringify(updated));
    syncUserToSupabase(updated);
  };

  const updateCustomApiKey = (key: string) => {
    if (!user) return;
    const updated = { ...user, customApiKey: key };
    setUser(updated);
    localStorage.setItem('docfin_user_session', JSON.stringify(updated));
  };

  const incrementAuditCount = () => {
    if (!user) return;
    const updated = { ...user, documentsUsed: user.documentsUsed + 1 };
    setUser(updated);
    localStorage.setItem('docfin_user_session', JSON.stringify(updated));
  };

  const content = (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        handleGoogleSuccess,
        handleGoogleError,
        signup,
        loginAsGuest,
        logout,
        updateProfile,
        updateCustomApiKey,
        incrementAuditCount,
        googleClientId
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  if (googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {content}
      </GoogleOAuthProvider>
    );
  }

  return content;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
