import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Environment variables or labelled placeholders
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '[FIREBASE_API_KEY]',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '[FIREBASE_AUTH_DOMAIN]',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'haven-wellbeing-prod',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '[FIREBASE_STORAGE_BUCKET]',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '[FIREBASE_MESSAGING_SENDER_ID]',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '[FIREBASE_APP_ID]',
};

// Singleton initialization
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Optional Emulator Connection for local testing
  if (
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true' &&
    !(auth as any)._emulatorConnected
  ) {
    try {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      (auth as any)._emulatorConnected = true;
    } catch {
      // Ignore if already connected in hot-reload
    }
  }
} else {
  // Server-side safe mock/dummy object
  app = (getApps().length > 0 ? getApp() : null) as any;
  auth = (app ? getAuth(app) : {}) as any;
  db = (app ? getFirestore(app) : {}) as any;
}

const googleProvider = new GoogleAuthProvider();

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
};
export type { User };
