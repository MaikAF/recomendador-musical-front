import { Music, X } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/login');
      onClose();
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error iniciando login:", error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#121212', padding: '40px', borderRadius: '20px', width: '450px',
        color: 'white', textAlign: 'center', border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,255,148,0.1)'
      }}>
        {/* Botón cerrar (opcional, por si el usuario quiere cancelar) */}
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <X />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
             <div style={{ background: '#282828', padding: '20px', borderRadius: '50%' }}>
                <Music size={48} color="#00FF94" />
             </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Bienvenido a tu Asistente Musical</h2>
        
        <p style={{ color: '#aaa', marginBottom: '30px', lineHeight: '1.5' }}>
          Conecta tu cuenta para recibir recomendaciones personalizadas basadas en tu historial.
        </p>

        <button 
            onClick={handleLogin}
            style={{ 
                width: '100%', backgroundColor: '#00FF94', color: '#000', padding: '15px', 
                border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', 
                cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
            <Music size={20} /> Conectar con Spotify
        </button>
      </div>
    </div>
  );
}