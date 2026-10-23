'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  db,
  doc,
  getDoc,
  setDoc,
} from './firebase/client';
import { ENTERPRISE_SQUADS } from './enterprise-data';
import {
  authenticateWithDatabase,
  registerWithDatabase,
  getActiveDatabaseSession,
  clearDatabaseSession,
  mapDatabaseUserToProfile,
} from './db-auth';

export type UserRole = 'employee' | 'manager' | 'hrbp' | 'senior_leadership' | 'company_admin';
export type SessionMode = 'loading' | 'signed-out' | 'real' | 'demo';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  companyId: string;
  companyName: string;
  teamId: string;
  teamName: string;
  businessUnitId: string;
  businessUnitName: string;
  requestedRole: UserRole;
  approvedRole: UserRole;
  isApproved: boolean;
  emailVerified: boolean;
  isDemo?: boolean;
}

export function getRoleDashboardPath(role?: UserRole): string {
  switch (role) {
    case 'employee':
      return '/dashboard/employee';
    case 'manager':
      return '/dashboard/manager';
    case 'hrbp':
      return '/dashboard/hr';
    case 'senior_leadership':
      return '/dashboard/director';
    case 'company_admin':
      return '/dashboard/admin';
    default:
      return '/dashboard/manager';
  }
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  sessionMode: SessionMode;
  isLoading: boolean;
  isDemo: boolean;
  demoDatasetId: string;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'register' | 'demo';
  openAuthModal: (tab?: 'signin' | 'register' | 'demo') => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    name: string;
    email: string;
    pass: string;
    companyMode: 'create' | 'join';
    companyNameOrCode: string;
    requestedRole: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  enterDemo: (role: UserRole, datasetId?: string) => void;
  resetDemo: () => void;
  signOutUser: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  switchDemoDataset: (datasetId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionMode, setSessionMode] = useState<SessionMode>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [demoDatasetId, setDemoDatasetId] = useState('squad-01');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register' | 'demo'>('demo');

  // 1. Initial State Restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL Hash for auth tab without causing route collision
    const hash = window.location.hash.toLowerCase();
    if (hash === '#signin') {
      setAuthModalTab('signin');
      setIsAuthModalOpen(true);
    } else if (hash === '#register') {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
    } else if (hash === '#demo') {
      setAuthModalTab('demo');
      setIsAuthModalOpen(true);
    }

    // Check localStorage for persisted Real Database Session first
    const activeDbUser = getActiveDatabaseSession();
    if (activeDbUser) {
      const dbProf = mapDatabaseUserToProfile(activeDbUser);
      setIsDemo(false);
      setProfile(dbProf);
      setUser({
        uid: activeDbUser.uid,
        email: activeDbUser.email,
        displayName: activeDbUser.displayName,
      } as any);
      setSessionMode('real');
      setIsLoading(false);
      return;
    }

    // Check localStorage for persisted Demo Session
    const savedDemo = localStorage.getItem('pulse_demo_session') || localStorage.getItem('haven_demo_session');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        if (parsed?.profile) {
          setIsDemo(true);
          setDemoDatasetId(parsed.datasetId || 'squad-01');
          setProfile(parsed.profile);
          setUser(null);
          setSessionMode('demo');
          setIsLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem('pulse_demo_session');
        localStorage.removeItem('haven_demo_session');
      }
    }

    // 2. Firebase Auth Listener
    if (auth && typeof onAuthStateChanged === 'function') {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        // Strict Guard: Real auth listener must NEVER clear an active demo session
        const activeDemoRaw = localStorage.getItem('pulse_demo_session') || localStorage.getItem('haven_demo_session');
        if (activeDemoRaw) {
          return;
        }

        if (fbUser) {
          setUser(fbUser);
          setIsDemo(false);
          setSessionMode('real');

          try {
            if (db) {
              const userDocRef = doc(db, 'users', fbUser.uid);
              const snap = await getDoc(userDocRef);
              if (snap.exists()) {
                setProfile(snap.data() as UserProfile);
              } else {
                const fallbackProfile: UserProfile = {
                  uid: fbUser.uid,
                  email: fbUser.email || '',
                  displayName: fbUser.displayName || 'Enterprise Member',
                  companyId: 'company-acme',
                  companyName: 'Acme Corporation',
                  teamId: 'squad-01',
                  teamName: 'Squad 01 (Payments & Ledger)',
                  businessUnitId: 'unit-fintech',
                  businessUnitName: 'Financial Services',
                  requestedRole: 'employee',
                  approvedRole: 'employee',
                  isApproved: true,
                  emailVerified: fbUser.emailVerified,
                };
                setProfile(fallbackProfile);
              }
            }
          } catch {
            // Offline/fallback
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsDemo(false);
          setSessionMode('signed-out');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setSessionMode('signed-out');
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = useCallback((tab: 'signin' | 'register' | 'demo' = 'demo') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // 3. Synchronous Demo Mode Entry
  const enterDemo = useCallback((role: UserRole, datasetId: string = 'squad-01') => {
    const squad = ENTERPRISE_SQUADS.find((s) => s.id === datasetId) || ENTERPRISE_SQUADS[0];

    const demoProfile: UserProfile = {
      uid: `demo-${role}-${Date.now()}`,
      email: `${role}@sample-company.demo`,
      displayName:
        role === 'employee'
          ? 'Ananya Sharma (Senior Engineer)'
          : role === 'manager'
          ? 'Rajesh Nair (Delivery Manager)'
          : role === 'hrbp'
          ? 'Kavita Menon (Lead HRBP)'
          : role === 'senior_leadership'
          ? 'Vikramaditya Rao (VP Engineering)'
          : 'Siddharth Varma (Admin)',
      companyId: 'company-demo-01',
      companyName: 'Nexus Global Technologies (Demo)',
      teamId: squad.id,
      teamName: squad.name,
      businessUnitId: 'bu-core',
      businessUnitName: squad.businessUnit,
      requestedRole: role,
      approvedRole: role,
      isApproved: true,
      emailVerified: true,
      isDemo: true,
    };

    clearDatabaseSession();
    // Synchronous state commitment
    setIsDemo(true);
    setDemoDatasetId(datasetId);
    setProfile(demoProfile);
    setUser(null);
    setSessionMode('demo');
    setIsLoading(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'pulse_demo_session',
        JSON.stringify({ datasetId, profile: demoProfile })
      );
      localStorage.removeItem('haven_demo_session');
    }

    closeAuthModal();

    // Navigate once cleanly to the role's dashboard route
    const target = getRoleDashboardPath(role);
    router.push(target);
  }, [closeAuthModal, router]);

  const resetDemo = useCallback(() => {
    clearDatabaseSession();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pulse_demo_session');
      localStorage.removeItem('haven_demo_session');
    }
    setIsDemo(false);
    setProfile(null);
    setUser(null);
    setSessionMode('signed-out');
    router.push('/');
  }, [router]);

  const switchDemoRole = useCallback((newRole: UserRole) => {
    enterDemo(newRole, demoDatasetId);
  }, [enterDemo, demoDatasetId]);

  const switchDemoDataset = useCallback((newDatasetId: string) => {
    if (profile) {
      enterDemo(profile.approvedRole, newDatasetId);
    }
  }, [enterDemo, profile]);

  // 4. Real Database and Firebase Authentication Methods
  const signIn = async (email: string, pass: string) => {
    // 1. Primary: Authenticate with persistent local database
    const dbResult = authenticateWithDatabase(email, pass);
    if (dbResult.success && dbResult.user) {
      const dbProfile = mapDatabaseUserToProfile(dbResult.user);
      setUser({
        uid: dbResult.user.uid,
        email: dbResult.user.email,
        displayName: dbResult.user.displayName,
      } as any);
      setProfile(dbProfile);
      setIsDemo(false);
      setSessionMode('real');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pulse_demo_session');
        localStorage.removeItem('haven_demo_session');
      }
      closeAuthModal();
      const target = getRoleDashboardPath(dbProfile.approvedRole);
      router.push(target);
      return { success: true };
    }

    // 2. Secondary: If Firebase is configured with real key
    if (
      auth &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== '[FIREBASE_API_KEY]'
    ) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        setUser(cred.user);
        setIsDemo(false);
        setSessionMode('real');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pulse_demo_session');
          localStorage.removeItem('haven_demo_session');
        }
        closeAuthModal();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return {
      success: false,
      error: dbResult.error || 'Authentication failed. Please verify credentials.',
    };
  };

  const signUp = async (params: {
    name: string;
    email: string;
    pass: string;
    companyMode: 'create' | 'join';
    companyNameOrCode: string;
    requestedRole: UserRole;
  }) => {
    // 1. Primary: Register in persistent local database
    const regResult = registerWithDatabase(params);
    if (regResult.success && regResult.user) {
      const dbProfile = mapDatabaseUserToProfile(regResult.user);
      setUser({
        uid: regResult.user.uid,
        email: regResult.user.email,
        displayName: regResult.user.displayName,
      } as any);
      setProfile(dbProfile);
      setIsDemo(false);
      setSessionMode('real');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pulse_demo_session');
        localStorage.removeItem('haven_demo_session');
      }
      closeAuthModal();
      const target = getRoleDashboardPath(dbProfile.approvedRole);
      router.push(target);
      return { success: true };
    }

    // 2. Secondary: If Firebase is configured
    if (
      auth &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== '[FIREBASE_API_KEY]'
    ) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, params.email, params.pass);
        setUser(cred.user);
        setIsDemo(false);
        setSessionMode('real');

        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: params.email,
          displayName: params.name,
          companyId: params.companyMode === 'create' ? `comp-${Date.now()}` : params.companyNameOrCode,
          companyName: params.companyMode === 'create' ? params.companyNameOrCode : 'Affiliated Partner',
          teamId: 'squad-01',
          teamName: 'Core Delivery Squad',
          businessUnitId: 'bu-general',
          businessUnitName: 'Engineering',
          requestedRole: params.requestedRole,
          approvedRole: params.requestedRole === 'company_admin' ? 'company_admin' : 'employee',
          isApproved: params.requestedRole === 'company_admin',
          emailVerified: cred.user.emailVerified,
        };

        if (db) {
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        }
        setProfile(newProfile);
        closeAuthModal();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: false, error: regResult.error || 'Registration failed.' };
  };

  const signInWithGoogle = async () => {
    try {
      if (!auth || !googleProvider) throw new Error('Google Auth provider not ready');
      const cred = await signInWithPopup(auth, googleProvider);
      setUser(cred.user);
      setIsDemo(false);
      setSessionMode('real');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pulse_demo_session');
        localStorage.removeItem('haven_demo_session');
      }
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      if (!auth) throw new Error('Firebase Auth not available');
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const signOutUser = async () => {
    clearDatabaseSession();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pulse_demo_session');
      localStorage.removeItem('haven_demo_session');
    }
    if (isDemo) {
      resetDemo();
      return;
    }
    if (auth && typeof signOut === 'function') {
      try {
        await signOut(auth);
      } catch {
        // Safe fallback
      }
    }
    setUser(null);
    setProfile(null);
    setIsDemo(false);
    setSessionMode('signed-out');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        sessionMode,
        isLoading,
        isDemo,
        demoDatasetId,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInWithGoogle,
        sendPasswordReset,
        enterDemo,
        resetDemo,
        signOutUser,
        switchDemoRole,
        switchDemoDataset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
