// components/PreviewCard.jsx
import { useState, useRef } from 'react';
import { Music, Play, Pause } from 'lucide-react';

export default function PreviewCard({ data }) {
  // Estados para controlar el reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!data) return null;

  // Manejo seguro de datos (adaptado a la API de iTunes)
  const title = data.track_name || data.name || "Pista desconocida";
  const subtitle = data.artist_name || "Artista desconocido";
  const image = data.cover_url || data.image;
  const previewUrl = data.preview_url;

  // Función para manejar el Play/Pausa
  const togglePlay = (e) => {
    e.preventDefault();
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ 
        marginTop: '15px', 
        backgroundColor: '#1E1E1E', // Fondo oscuro neutro
        border: '1px solid #333',
        color: 'white',
        borderRadius: '12px',
        padding: '0', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '400px',
        overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, overflow: 'hidden' }}>
        {/* IMAGEN O ICONO */}
        {image ? (
            <img 
                src={image} 
                alt={title} 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
            />
        ) : (
            <div style={{ width: '80px', height: '80px', background: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={24} color="#666" />
            </div>
        )}

        {/* TEXTO */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0', overflow: 'hidden' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                {title}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px', marginTop: '2px' }}>
                {subtitle}
            </span>
        </div>
      </div>

      {/* REPRODUCTOR DE AUDIO (Solo se muestra si hay preview_url) */}
      {previewUrl && (
        <>
          <audio 
            ref={audioRef} 
            src={previewUrl} 
            onEnded={() => setIsPlaying(false)} // Vuelve al icono de Play cuando termina los 30s
          />
          <button 
            onClick={togglePlay}
            style={{ 
                background: '#00FF94', // Color de acento (haciendo match con tu modal)
                color: 'black', 
                width: '40px',
                height: '40px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0,
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </button>
        </>
      )}
    </div>
  );
}