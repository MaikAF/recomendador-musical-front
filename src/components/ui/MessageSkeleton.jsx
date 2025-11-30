import { Bot } from 'lucide-react';

export default function MessageSkeleton() {
  return (
    <div className="msg-row bot">
      {/* Avatar estático */}
      <div className="avatar bot">
        <Bot size={18} color="#00FF94"/>
      </div>
      
      {/* Burbuja con el esqueleto */}
      <div className="msg-bubble bot" style={{ width: '100%' }}>
        <div className="skeleton-wrapper">
          {/* Simulamos 3 líneas de texto de diferente largo */}
          <div className="skeleton-text" style={{ width: '60%' }}></div>
          <div className="skeleton-text" style={{ width: '85%' }}></div>
          <div className="skeleton-text" style={{ width: '40%' }}></div>
          
          {/* Simulamos la tarjeta de Spotify cargando */}
          <div className="skeleton-card"></div>
        </div>
      </div>
    </div>
  );
}
