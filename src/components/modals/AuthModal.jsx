import { useState } from 'react';
import { Music, X, Radio } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onLastFMLogin }) {
  const [lastFmUsername, setLastFmUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Manejador del botón de Last.FM
  const submitLastFm = async () => {
      if (!lastFmUsername.trim()) {
          setErrorMsg("Por favor, ingresa tu usuario.");
          return;
      }
      
      setIsConnecting(true);
      setErrorMsg('');
      
      // Llamamos a la función del hook
      const result = await onLastFMLogin(lastFmUsername);
      
      setIsConnecting(false);
      
      if (result && result.success) {
          onClose(); // Cerramos el modal si fue exitoso
      } else {
          setErrorMsg(result?.message || "No se pudo conectar con Last.FM");
      }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ backgroundColor: '#121212', padding: '40px', borderRadius: '20px', width: '450px', color: 'white', textAlign: 'center', border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,255,148,0.1)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <X />
        </button>

        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
             <div style={{ background: '#282828', padding: '20px', borderRadius: '50%' }}>
                <Music size={48} color="#00FF94" />
             </div>
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Bienvenido a tu Asistente</h2>
        <p style={{ color: '#aaa', marginBottom: '30px', lineHeight: '1.5' }}>Conecta tu cuenta para recibir recomendaciones personalizadas.</p>

        {/* Botón Spotify */}
        <button 
            onClick={() => {
                if (typeof onLogin === 'function') onLogin(); 
            }}
            style={{ width: '100%', backgroundColor: '#00FF94', color: '#000', padding: '15px', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <Music size={20} /> Conectar con Spotify
        </button>

        {/* Separador Visual */}
        <div style={{ margin: '25px 0', borderBottom: '1px solid #333', position: 'relative' }}>
            <span style={{ backgroundColor: '#121212', padding: '0 15px', color: '#666', fontSize: '0.9rem', position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
                O usar perfil público
            </span>
        </div>

        {/* Formulario Last.FM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '35px' }}>
            <input 
                type="text" 
                placeholder="Nombre de usuario en Last.FM" 
                value={lastFmUsername}
                onChange={(e) => setLastFmUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitLastFm()}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: 'white', boxSizing: 'border-box', outline: 'none' }}
            />
            
            {errorMsg && <span style={{ color: '#ff4444', fontSize: '0.85rem', textAlign: 'left', marginLeft: '5px' }}>{errorMsg}</span>}
            
            <button 
                onClick={submitLastFm}
                disabled={isConnecting}
                style={{ width: '100%', backgroundColor: '#d51007', color: '#fff', padding: '15px', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: isConnecting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isConnecting ? 0.7 : 1, transition: 'transform 0.2s' }}
                onMouseOver={(e) => !isConnecting && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Radio size={20} /> {isConnecting ? 'Conectando...' : 'Conectar con Last.FM'}
            </button>
        </div>

      </div>
    </div>
  );
}