// src/components/auth-form.tsx
'use client'; // <-- IMPORTANTE: Esto le dice a Next.js que este componente es para el cliente

import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; // SOLO importa 'auth' de tu archivo de Firebase
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
// Importa las funciones de Firestore y la función para obtener la app Firebase
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 
import { getApp } from 'firebase/app'; // Para obtener la instancia de la aplicación Firebase

function AuthForm() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [user, setUser] = useState<any>(null); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    // Suscribe a los cambios de estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      if (currentUser) {
        setMessage(`¡Hola, ${currentUser.email}!`); 
      } else {
        setMessage('No hay sesión iniciada.'); 
      }
    });
    // Limpia la suscripción al desmontar el componente
    return () => unsubscribe(); 
  }, []); 

  const handleRegister = async () => {
    if (!email || !password) {
      setMessage('Por favor, ingresa correo y contraseña.');
      return;
    }
    try {
      // Intenta crear el usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      setMessage(`¡Usuario ${newUser.email} registrado y logeado exitosamente!`);

      // =====================================================================================
      // NUEVO BLOQUE TRY-CATCH para la escritura en Firestore
      // Esto aísla los errores de Firestore de los de Authentication y maneja el "Unknown SID".
      // =====================================================================================
      try {
          // Obtiene la instancia de la aplicación Firebase ya inicializada.
          const currentApp = getApp(); 
          // Obtiene la instancia de Firestore usando esa app, asegurando una conexión válida.
          const directDb = getFirestore(currentApp); 

          // Guarda información adicional del usuario en Firestore
          await setDoc(doc(directDb, "users", newUser.uid), {
              email: newUser.email,
              fechaRegistro: new Date().toISOString(),
              plan: "Free", // Valor por defecto para nuevos registros web
              // ... puedes añadir aquí más campos por defecto o vacíos
          });
          console.log("Información básica del usuario guardada en Firestore.");

      } catch (firestoreError: any) { // Captura errores ESPECÍFICOS de Firestore aquí
          console.error("Error al guardar en Firestore (después de autenticación):", firestoreError.code, firestoreError.message);
          // Si hubo un error en Firestore, informamos al usuario, pero la cuenta de Auth ya está creada.
          setMessage(`¡Usuario ${newUser.email} registrado, pero hubo un error al guardar sus datos en Firestore. (${firestoreError.message})`);
          // No hacemos 'return' aquí para que la UI de éxito de Auth se muestre, pero indicando el problema de Firestore.
      }
      // =====================================================================================

    } catch (error: any) { // Este catch es para errores de Firebase Authentication (createUserWithEmailAndPassword)
      console.error("Error al registrar (Auth):", error.code, error.message);
      let msg = "Error al registrarse. ";
      switch (error.code) {
          case 'auth/email-already-in-use': msg += "Este correo ya está en uso."; break;
          case 'auth/invalid-email': msg += "El formato del correo es inválido."; break;
          case 'auth/weak-password': msg += "La contraseña es muy débil (mínimo 6 caracteres)."; break;
          default: msg += "Error inesperado.";
      }
      setMessage(msg);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Por favor, ingresa correo y contraseña.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Inicio de sesión exitoso!');
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      let msg = "Error al iniciar sesión. ";
      switch (error.code) {
          case 'auth/invalid-email': msg += "El formato del correo es inválido."; break;
          case 'auth/user-disabled': msg += "Usuario deshabilitado."; break;
          case 'auth/user-not-found': 
          case 'auth/wrong-password': msg += "Correo o contraseña incorrectos."; break;
          default: msg += "Error inesperado.";
      }
      setMessage(msg);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('Sesión cerrada.');
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error.code, error.message);
      setMessage('Error al cerrar sesión.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#0070f3' }}>Autenticación de Usuarios</h2>
      {user ? (
        // Contenedor para el usuario logeado
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>¡Bienvenido, <strong style={{ color: '#0070f3' }}>{user.email}</strong>!</p>
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#dc3545', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' 
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        // Contenedor para el formulario de login/registro
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>Regístrate o Inicia Sesión</h3>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Correo electrónico"
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Contraseña (mínimo 6 caracteres)"
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleRegister}
              style={{ 
                flex: 1, backgroundColor: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' 
              }}
            >
              Registrarse
            </button> 
            <button 
              onClick={handleLogin}
              style={{ 
                flex: 1, backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' 
              }}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
      <p style={{ color: message.includes('Error') ? '#dc3545' : '#28a745', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>
    </div>
  );
}

export default AuthForm;
