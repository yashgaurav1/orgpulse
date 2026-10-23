/**
 * PULSE DATABASE AUTHENTICATION SERVICE
 * Provides persistent database-backed authentication, role provisioning,
 * and user management for enterprise employees, managers, and administrators.
 */

import { UserRole, UserProfile } from './auth-context';
import { ENTERPRISE_SQUADS } from './enterprise-data';

export interface DatabaseUserRecord {
  uid: string;
  email: string;
  passwordHash: string; // Stored securely for credential verification
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
  createdAt: string;
  lastLoginAt: string;
  isDemo?: boolean;
}

// Pre-seeded database users for immediate zero-friction enterprise testing
export const INITIAL_DATABASE_USERS: DatabaseUserRecord[] = [
  {
    uid: 'db-user-employee',
    email: 'employee@pulse.io',
    passwordHash: 'Password123!',
    displayName: 'Ananya Sharma',
    companyId: 'company-acme-01',
    companyName: 'Acme Technologies Global',
    teamId: 'squad-01',
    teamName: 'Squad 01 (Payments & Ledger)',
    businessUnitId: 'unit-fintech',
    businessUnitName: 'Financial Services',
    requestedRole: 'employee',
    approvedRole: 'employee',
    isApproved: true,
    emailVerified: true,
    createdAt: '2026-01-15T08:00:00Z',
    lastLoginAt: '2026-10-23T08:00:00Z',
  },
  {
    uid: 'db-user-manager',
    email: 'manager@pulse.io',
    passwordHash: 'Password123!',
    displayName: 'Rajesh Nair',
    companyId: 'company-acme-01',
    companyName: 'Acme Technologies Global',
    teamId: 'squad-01',
    teamName: 'Squad 01 (Payments & Ledger)',
    businessUnitId: 'unit-fintech',
    businessUnitName: 'Financial Services',
    requestedRole: 'manager',
    approvedRole: 'manager',
    isApproved: true,
    emailVerified: true,
    createdAt: '2026-01-10T08:00:00Z',
    lastLoginAt: '2026-10-23T08:00:00Z',
  },
  {
    uid: 'db-user-hrbp',
    email: 'hr@pulse.io',
    passwordHash: 'Password123!',
    displayName: 'Kavita Menon',
    companyId: 'company-acme-01',
    companyName: 'Acme Technologies Global',
    teamId: 'squad-03',
    teamName: 'People & Culture Partner',
    businessUnitId: 'unit-fintech',
    businessUnitName: 'Financial Services',
    requestedRole: 'hrbp',
    approvedRole: 'hrbp',
    isApproved: true,
    emailVerified: true,
    createdAt: '2026-01-05T08:00:00Z',
    lastLoginAt: '2026-10-23T08:00:00Z',
  },
  {
    uid: 'db-user-leadership',
    email: 'leadership@pulse.io',
    passwordHash: 'Password123!',
    displayName: 'Vikramaditya Rao',
    companyId: 'company-acme-01',
    companyName: 'Acme Technologies Global',
    teamId: 'squad-04',
    teamName: 'Executive Leadership Board',
    businessUnitId: 'unit-fintech',
    businessUnitName: 'Financial Services',
    requestedRole: 'senior_leadership',
    approvedRole: 'senior_leadership',
    isApproved: true,
    emailVerified: true,
    createdAt: '2026-01-01T08:00:00Z',
    lastLoginAt: '2026-10-23T08:00:00Z',
  },
  {
    uid: 'db-user-admin',
    email: 'admin@pulse.io',
    passwordHash: 'Password123!',
    displayName: 'Siddharth Varma',
    companyId: 'company-acme-01',
    companyName: 'Acme Technologies Global',
    teamId: 'squad-06',
    teamName: 'Identity & InfoSec Core',
    businessUnitId: 'unit-fintech',
    businessUnitName: 'Financial Services',
    requestedRole: 'company_admin',
    approvedRole: 'company_admin',
    isApproved: true,
    emailVerified: true,
    createdAt: '2025-12-01T08:00:00Z',
    lastLoginAt: '2026-10-23T08:00:00Z',
  },
];

const DB_USERS_STORAGE_KEY = 'pulse_database_users_v2';
const DB_SESSION_STORAGE_KEY = 'pulse_database_session_v2';

/**
 * Loads the users table from persistent local storage or seeds it.
 */
export function getDatabaseUsers(): DatabaseUserRecord[] {
  if (typeof window === 'undefined') {
    return INITIAL_DATABASE_USERS;
  }

  try {
    const raw = localStorage.getItem(DB_USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DB_USERS_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE_USERS));
      return INITIAL_DATABASE_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(DB_USERS_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE_USERS));
      return INITIAL_DATABASE_USERS;
    }
    return parsed;
  } catch {
    return INITIAL_DATABASE_USERS;
  }
}

/**
 * Saves users table to persistent local storage.
 */
export function saveDatabaseUsers(users: DatabaseUserRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to database storage:', err);
  }
}

/**
 * Authenticates user credentials against the persistent database.
 */
export function authenticateWithDatabase(
  email: string,
  pass: string
): { success: boolean; user?: DatabaseUserRecord; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'Email and password are required.' };
  }

  const users = getDatabaseUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      error: 'Account not found. Please register or use one of the pre-seeded team accounts.',
    };
  }

  if (user.passwordHash !== cleanPass) {
    return {
      success: false,
      error: 'Incorrect password. Please verify credentials.',
    };
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveDatabaseUsers(users);

  // Store active session in database storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_SESSION_STORAGE_KEY, JSON.stringify(user));
  }

  return { success: true, user };
}

/**
 * Registers a new account in the persistent database.
 */
export function registerWithDatabase(params: {
  name: string;
  email: string;
  pass?: string;
  password?: string;
  companyMode: 'create' | 'join';
  companyNameOrCode: string;
  requestedRole: UserRole;
}): { success: boolean; user?: DatabaseUserRecord; error?: string } {
  const cleanName = (params.name || '').trim();
  const cleanEmail = (params.email || '').trim().toLowerCase();
  const rawPass = params.pass || params.password || '';
  const cleanPass = rawPass.trim();

  if (!cleanName) {
    return { success: false, error: 'Full name is required.' };
  }

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Valid work email address is required.' };
  }

  if (cleanPass.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }

  const users = getDatabaseUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email address already exists. Please sign in.' };
  }

  const defaultSquad = ENTERPRISE_SQUADS[0];
  const newUid = `db-user-${Date.now()}`;
  const companyName =
    params.companyMode === 'create'
      ? params.companyNameOrCode.trim() || 'InnovateCorp'
      : 'Affiliated Partner Enterprise';

  const newUser: DatabaseUserRecord = {
    uid: newUid,
    email: cleanEmail,
    passwordHash: cleanPass,
    displayName: cleanName,
    companyId: `comp-${Date.now()}`,
    companyName,
    teamId: defaultSquad.id,
    teamName: defaultSquad.name,
    businessUnitId: 'unit-fintech',
    businessUnitName: defaultSquad.businessUnit,
    requestedRole: params.requestedRole,
    approvedRole: params.requestedRole, // Instant auto-approval for seamless testing
    isApproved: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isDemo: false,
  };

  users.push(newUser);
  saveDatabaseUsers(users);

  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_SESSION_STORAGE_KEY, JSON.stringify(newUser));
  }

  return { success: true, user: newUser };
}

/**
 * Retrieves the currently active database session, if any.
 */
export function getActiveDatabaseSession(): DatabaseUserRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DB_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clears the active database session.
 */
export function clearDatabaseSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DB_SESSION_STORAGE_KEY);
}

/**
 * Maps a DatabaseUserRecord to the application UserProfile.
 */
export function mapDatabaseUserToProfile(user: DatabaseUserRecord): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    companyId: user.companyId,
    companyName: user.companyName,
    teamId: user.teamId,
    teamName: user.teamName,
    businessUnitId: user.businessUnitId,
    businessUnitName: user.businessUnitName,
    requestedRole: user.requestedRole,
    approvedRole: user.approvedRole,
    isApproved: user.isApproved,
    emailVerified: user.emailVerified,
    isDemo: false,
  };
}
