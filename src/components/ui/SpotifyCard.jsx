import { useState, useRef } from 'react';
import { ExternalLink, Music, Disc, Mic2, ListMusic, Play, Pause } from 'lucide-react';

export default function SpotifyCard({ data }) {
  // Estados para controlar el reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!data) return null;

  // Elegir icono según el tipo
  const getIcon = () => {
    switch(data.type) {
        case 'artist': return <Mic2 size={24} />;
        case 'album': return <Disc size={24} />;
        case 'track': return <Music size={24} />;
        default: return <ListMusic size={24} />;
    }
  };

  // Función para manejar el Play/Pausa
  const togglePlay = (e) => {
    e.preventDefault(); // Evita comportamientos raros
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
        backgroundColor: '#1DB954',
        color: 'black',
        borderRadius: '12px',
        padding: '0', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '400px',
        overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(29, 185, 84, 0.3)'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
        {/* IMAGEN O ICONO */}
        {data.image ? (
            <img 
                src={data.image} 
                alt={data.name} 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
            />
        ) : (
            <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getIcon()}
            </div>
        )}

        {/* TEXTO */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.8 }}>
                {data.type === 'track' ? 'Canción' : data.type}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                {data.name}
            </span>
        </div>
      </div>

      {/* LÓGICA DEL BOTÓN: Reproductor o Enlace Externo */}
      {data.preview_url ? (
        <>
          {/* Elemento de audio invisible */}
          <audio 
            ref={audioRef} 
            src={data.preview_url} 
            onEnded={() => setIsPlaying(false)} // Vuelve al icono de Play cuando termina
          />
          <button 
            onClick={togglePlay}
            style={{ 
                background: 'black', 
                color: 'white', 
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
      ) : (
        /* Fallback: Si no hay preview (o es un artista/álbum), mandamos a Spotify */
        <a 
          href={data.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
              background: 'black', 
              color: 'white', 
              width: '40px',
              height: '40px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '15px',
              flexShrink: 0,
              transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ExternalLink size={18} />
        </a>
      )}
    </div>
  );
}