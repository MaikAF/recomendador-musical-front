import { X, Trash2, LogOut, User } from 'lucide-react';
import axios from 'axios';

export default function SettingsModal({ isOpen, onClose, userId, onLogout, onClearHistory }) {
  if (!isOpen) return null;

  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que quieres desconectar tu cuenta?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/logout/${userId}`);
        onLogout(); // Limpiar estado en el frontend
        onClose();
      } catch (error) {
        console.error("Error cerrando sesión:", error);
      }
    }
  };

const handleClearHistory = async () => {
    if (confirm("¿Estás seguro de que quieres borrar TODAS tus conversaciones?")) {
        try {
            await axios.delete(`http://127.0.0.1:8000/conversations/${userId}`);
            alert("Historial eliminado.");
            if (onHistoryCleared) onHistoryCleared(); // Avisar a App.jsx para limpiar la lista
            onClose();
        } catch (error) {
            console.error("Error borrando historial:", error);
            alert("Error al borrar historial.");
        }
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#282828', padding: '0', borderRadius: '15px', width: '350px',
        color: 'white', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} color="#00FF94"/> Configuración
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20}/></button>
        </div>

        {/* Info Usuario */}
        <div style={{ padding: '20px', backgroundColor: '#1E1E1E' }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Usuario ID:</p>
          <code style={{ color: '#00FF94', fontSize: '0.8rem' }}>{userId}</code>
        </div>

        {/* Opciones */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Opción: Borrar Historial (Futuro) */}
          <button onClick={handleClearHistory} style={{ 
            background: '#333', border: 'none', padding: '15px', borderRadius: '10px', 
            color: 'white', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', textAlign: 'left' 
          }}>
            <Trash2 size={20} color="#FF4444" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Borrar Historial</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Eliminar conversaciones de la vista</div>
            </div>
          </button>

          {/* Opción: Cerrar Sesión */}
          <button onClick={handleLogout} style={{ 
            background: '#333', border: 'none', padding: '15px', borderRadius: '10px', 
            color: 'white', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', textAlign: 'left' 
          }}>
            <LogOut size={20} color="#aaa" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Cerrar Sesión</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Desconectar tu cuenta de Spotify</div>
            </div>
          </button>
        </div>

        <div style={{ padding: '20px', textAlign: 'center' }}>
            <button onClick={onClose} style={{ background: '#00FF94', border: 'none', padding: '10px 30px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
}