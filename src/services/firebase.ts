import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  Auth, 
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

const getFirebaseApp = () => {
  if (!app) {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) {
      // We don't throw here to avoid crashing the whole app at load time
      // Instead, we return null and handle it in the getters
      console.warn("Firebase API Key is missing. Check VITE_FIREBASE_API_KEY.");
      return null;
    }
    
    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getAuthInstance = (): Auth | null => {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  
  if (!authInstance) {
    authInstance = getAuth(firebaseApp);
  }
  return authInstance;
};

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase not initialized");
  return signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  const auth = getAuthInstance();
  if (!auth) return;
  return signOut(auth);
};

export { signInWithEmailAndPassword, createUserWithEmailAndPassword };
