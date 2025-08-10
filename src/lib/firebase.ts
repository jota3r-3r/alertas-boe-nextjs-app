// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Define una interfaz para la configuración de Firebase para mayor claridad de tipos
interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
  databaseURL?: string; // Aunque no la usemos directamente, puede ser parte de la config
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// La configuración de FIREBASE_WEBAPP_CONFIG es para el build/server-side.
// Para el lado del cliente, Next.js usa las variables NEXT_PUBLIC_.
const firebaseConfigFromEnv: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    // Otras propiedades como databaseURL, si las necesitas, también deberían ser NEXT_PUBLIC_
    // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// *** ESTE console.log ES CLAVE PARA LA DEPURACIÓN ***
console.log("Firebase config obtenida en el cliente (desde NEXT_PUBLIC_):", firebaseConfigFromEnv);
console.log("API Key en cliente:", firebaseConfigFromEnv.apiKey ? "Presente" : "Faltante o Vacía");

// 3. Verificar que tenemos una configuración válida antes de inicializar Firebase
//    Solo necesitamos verificar el apiKey para la inicialización básica.
if (!firebaseConfigFromEnv.apiKey) {
  console.error("¡ERROR FATAL! La configuración de Firebase está incompleta para la inicialización en el navegador.");
  console.error("Revisa que tus variables NEXT_PUBLIC_FIREBASE_... estén bien configuradas en tu apphosting.yaml o .env.local.");
  throw new Error("La configuración de Firebase es requerida para la inicialización.");
}

// Inicializar Firebase solo una vez para evitar errores de duplicidad
if (!getApps().length) {
  app = initializeApp(firebaseConfigFromEnv);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
