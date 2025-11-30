import { Music, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  // DEBUG: Verificar qué recibió el modal
  console.log("🟣 [AuthModal] Renderizado. onLogin es tipo:", typeof onLogin);

  return (
    <div style={{ /* ... estilos container ... */ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ /* ... estilos caja ... */ backgroundColor: '#121212', padding: '40px', borderRadius: '20px', width: '450px', color: 'white', textAlign: 'center', border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,255,148,0.1)', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <X />
        </button>

        {/* ... (Icono y Texto) ... */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
             <div style={{ background: '#282828', padding: '20px', borderRadius: '50%' }}>
                <Music size={48} color="#00FF94" />
             </div>
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Bienvenido a tu Asistente Musical</h2>
        <p style={{ color: '#aaa', marginBottom: '30px', lineHeight: '1.5' }}>Conecta tu cuenta para recibir recomendaciones personalizadas.</p>

        <button 
            onClick={() => {
                console.log("🟣 [AuthModal] Click detectado en botón");
                if (typeof onLogin === 'function') {
                    console.log("🟣 [AuthModal] Ejecutando onLogin()...");
                    onLogin(); 
                } else {
                    console.error("🔴 [AuthModal] ERROR: onLogin no es una función. Es:", onLogin);
                }
            }}
            style={{ width: '100%', backgroundColor: '#00FF94', color: '#000', padding: '15px', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
            <Music size={20} /> Conectar con Spotify
        </button>
      </div>
    </div>
  );
}
