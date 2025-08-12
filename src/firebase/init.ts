// src/firebase/init.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TU firebaseConfig REAL - ¡PROPORCIONADO POR TI!
const firebaseConfig = {
  apiKey: "AIzaSyCU3m_COcDGHeCMVA7AnqOFa-Xy9l8Xo2I",
  authDomain: "boe-radar.firebaseapp.com",
  projectId: "boe-radar",
  storageBucket: "boe-radar.firebasestorage.app",
  messagingSenderId: "560783731487",
  appId: "1:560783731487:web:62d122c24342997bea9e2a",
  measurementId: "G-GY3229P60H"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene las instancias de Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exporta las instancias para usarlas en otras partes de tu aplicación
export { app, auth, db };
