// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Define una interfaz para la configuración de Firebase para mayor claridad de tipos
interface FirebaseConfig {
  apiKey: string; // Hacemos que estas sean requeridas ya que las hardcodearemos
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // Optional, as it might not always be used
  databaseURL?: string;
}

// ** ATENCIÓN: VALORES HARDCODEADOS PARA PRUEBAS Y DIAGNÓSTICO **
// ESTA ES UNA SOLUCIÓN TEMPORAL PARA DEBUGGING.
// EN UN ENTORNO REAL, PREFERIRÍAS CARGAR ESTO DESDE VARIABLES DE ENTORNO SEGURAS.
const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyCU3m_COcDGHeCMVA7AnqOFa-Xy9l8Xo2I", // <-- ¡TU API KEY REAL AQUÍ!
    authDomain: "boe-radar.firebaseapp.com", // <-- ¡TU AUTH DOMAIN REAL AQUÍ!
    projectId: "boe-radar", // <-- ¡TU PROJECT ID REAL AQUÍ!
    storageBucket: "boe-radar.firebasestorage.app", // <-- ¡TU STORAGE BUCKET REAL AQUÍ!
    messagingSenderId: "560783731487", // <-- ¡TU MESSAGING SENDER ID REAL AQUÍ!
    appId: "1:560783731487:web:62d122c24342997bea9e2a", // <-- ¡TU APP ID REAL AQUÍ!
    measurementId: "G-GY3229P60H" // <-- ¡TU MEASUREMENT ID REAL AQUÍ si lo usas!
};

// ** SOLO PARA DIAGNÓSTICO: ESTE LOG DEBERÍA MOSTRAR LA CONFIGURACIÓN CORRECTA AHORA **
console.log("Firebase config hardcodeada en el cliente:", firebaseConfig);
console.log("API Key hardcodeada en cliente:", firebaseConfig.apiKey ? "Presente" : "Faltante o Vacía");


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// 3. Verificar que tenemos una configuración válida antes de inicializar Firebase
if (!firebaseConfig.apiKey) {
  console.error("¡ERROR FATAL! La configuración de Firebase está incompleta para la inicialización (hardcodeada).");
  throw new Error("La configuración de Firebase es requerida para la inicialización.");
}

// Inicializar Firebase solo una vez para evitar errores de duplicidad
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
