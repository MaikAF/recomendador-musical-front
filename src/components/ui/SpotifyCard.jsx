import { ExternalLink, Music, Disc, Mic2, ListMusic } from 'lucide-react';

export default function SpotifyCard({ data }) {
  if (!data) return null;

  // Mapeo de iconos
  const getIcon = () => {
    switch(data.type) {
        case 'artist': return <Mic2 size={24} />;
        case 'album': return <Disc size={24} />;
        case 'track': return <Music size={24} />;
        default: return <ListMusic size={24} />;
    }
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
        {/* Imagen/Icono */}
        {data.image ? (
            <img 
                src={data.image} 
                alt={data.name} 
                style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover' 
                }} 
            />
        ) : (
            <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getIcon()}
            </div>
        )}

        {/* Contenido */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.8 }}>
                {data.type === 'track' ? 'Canción' : data.type}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                {data.name}
            </span>
        </div>
      </div>

      {/* Acción */}
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
    </div>
  );
}
