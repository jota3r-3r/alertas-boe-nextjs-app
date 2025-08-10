// src/app/page.tsx
// Importa el componente de formulario de autenticación que acabas de crear
// La ruta '../components/auth-form' es correcta si 'components' está en src/ y 'page.tsx' está en src/app/
import AuthForm from '../components/auth-form'; 

export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Bienvenido a Alertas BOE</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Esta es tu nueva aplicación Next.js integrada con Firebase.</p>
      
      <div style={{ marginTop: '30px', border: '1px solid #eee', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <AuthForm /> 
      </div>

      <p style={{ marginTop: '50px', fontSize: '0.8em', color: '#999', textAlign: 'center' }}>
        Get started by editing <code>src/app/page.tsx</code>. Save and see your changes instantly.
      </p>
    </main>
  );
}
