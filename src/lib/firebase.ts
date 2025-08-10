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
  databaseURL?: string; // Incluir por si acaso, Next.js a veces lo añade.
}

let app: FirebaseApp;
let auth: Auth; // <--- ¡VUELVE A SER 'let'!
let db: Firestore;   // <--- ¡VUELVE A SER 'let'!

// Determine la configuración de Firebase
let config: FirebaseConfig | undefined;

// 1. PRIORIZAR la configuración de FIREBASE_WEBAPP_CONFIG inyectada por Firebase App Hosting
//    Esto es crucial para que funcione correctamente durante el build/prerender de Next.js
if (typeof process !== 'undefined' && process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
        config = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
        // Firebase App Hosting a veces incluye measurementId dentro de la raíz de la config
        // y Next.js espera NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID por separado
        // Si measurementId viene en el JSON principal, asegúrate de que no se duplique o se use correctamente.
        // Para este caso, el JSON.parse ya debería capturar measurementId si está ahí.
    } catch (e) {
        console.error("Error al parsear FIREBASE_WEBAPP_CONFIG del entorno:", e);
        // Si falla el parseo, caemos al fallback de NEXT_PUBLIC_
    }
}

// 2. FALLBACK a las variables NEXT_PUBLIC_ (para desarrollo local o si el parseo falló)
//    Solo usa NEXT_PUBLIC_ si 'config' aún no se ha establecido correctamente con un apiKey
if (!config || !config.apiKey) {
    config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Desde .env.local o apphosting.yaml
    };
}

// 3. Verificar que tenemos una configuración válida antes de inicializar Firebase
if (!config || !config.apiKey) {
  console.error("La configuración de Firebase falta o es inválida. Revisa tus variables de entorno o apphosting.yaml.");
  // Lanza un error para detener el build/prerender si no hay config
  throw new Error("La configuración de Firebase es requerida para la inicialización.");
}

// Inicializar Firebase solo una vez para evitar errores de duplicidad
if (!getApps().length) {
  app = initializeApp(config);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
