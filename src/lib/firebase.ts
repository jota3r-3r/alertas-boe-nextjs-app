// src/lib/firebase.ts
import { initializeApp, getApps, getApp, deleteApp, FirebaseApp } from 'firebase/app'; // Importa deleteApp
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// =====================================================================================
// ATENCIÓN: VALORES HARDCODEADOS PARA PRUEBAS Y DIAGNÓSTICO
// Mantenemos la API Key hardcodeada para asegurar que llegue correctamente al build.
// =====================================================================================
const firebaseConfig = {
    apiKey: "AIzaSyCU3m_COcDGHeCMVA7AnqOFa-Xy9l8Xo2I", // <-- ¡TU API KEY REAL AQUÍ!
    authDomain: "boe-radar.firebaseapp.com", // <-- ¡TU AUTH DOMAIN REAL AQUÍ!
    projectId: "boe-radar", // <-- ¡TU PROJECT ID REAL AQUÍ!
    storageBucket: "boe-radar.firebasestorage.app", // <-- ¡TU STORAGE BUCKET REAL AQUÍ!
    messagingSenderId: "560783731487", // <-- ¡TU MESSAGING SENDER ID REAL AQUÍ!
    appId: "1:560783731487:web:62d122c24342997bea9e2a", // <-- ¡TU APP ID REAL AQUÍ!
    measurementId: "G-GY3229P60H" // <-- ¡TU MEASUREMENT ID REAL AQUÍ si lo usas!
    // databaseURL: "" // Deja esto vacío si usas Firestore Native
};

// =====================================================================================

console.log("Firebase config hardcodeada en el cliente:", firebaseConfig);
console.log("API Key hardcodeada en cliente:", firebaseConfig.apiKey ? "Presente" : "Faltante o Vacía");

let app: FirebaseApp;

// Si ya existe una app de Firebase, la borramos para forzar una reinicialización COMPLETA.
// ESTO ES PRINCIPALMENTE PARA DEPURACIÓN EN SITUACIONES DE ESTADO COMPLEJO COMO EL "Unknown SID".
// En una aplicación de producción normal, no deberías necesitar deleteApp constantemente.
if (getApps().length) {
    console.log("Detectada app Firebase existente. Borrándola para reinicializar.");
    deleteApp(getApp());
}

// Inicializa la app de Firebase.
app = initializeApp(firebaseConfig);
console.log("App Firebase inicializada o reinicializada.");

const auth: Auth = getAuth(app);
// NO exportamos 'db' directamente desde aquí.
// En 'auth-form.tsx', obtendremos 'db' con getFirestore(getApp()) para mayor robustez
// y evitar problemas de 'Unknown SID'.

export { app, auth }; // Exportamos 'app' y 'auth'. 'db' se obtendrá en el componente.
