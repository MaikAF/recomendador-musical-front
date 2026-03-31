import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Typewriter from './TypeWriter';
import SpotifyCard from './SpotifyCard';
import PreviewCard from './PreviewCard';
import { Bot } from 'lucide-react';

export default function BotMessage({ text, spotifyData, previewData, isHistory }) {
  console.log("💿 Datos recibidos en BotMessage:", { spotifyData, previewData });
  // Estados para controlar la secuencia de aparición
  const [part1Finished, setPart1Finished] = useState(false);
  
  // Procesamiento del texto
  const splitText = text.split('|||');
  const introText = splitText[0] || text;
  const detailsText = splitText[1] || '';

  // Si es historial, mostramos todo de golpe sin animaciones
  if (isHistory) {
    return (
      <div className="msg-row bot">
        <div className="avatar bot"><Bot size={18} color="#00FF94"/></div>
        <div className="msg-bubble bot">
          <ReactMarkdown>{introText}</ReactMarkdown>
          
          {/* AQUI MOSTRAMOS AMBAS EN EL HISTORIAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0' }}>
              {previewData && <PreviewCard data={previewData} />}
              {spotifyData && <SpotifyCard data={spotifyData} />}
          </div>

          {detailsText && <ReactMarkdown>{detailsText}</ReactMarkdown>}
        </div>
      </div>
    );
  }

  return (
    <div className="msg-row bot">
      <div className="avatar bot"><Bot size={18} color="#00FF94"/></div>
      <div className="msg-bubble bot" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/*PRIMERA PARTE, INTRODUCCION*/}
        <Typewriter 
          text={introText} 
          speed={15} 
          onComplete={() => setPart1Finished(true)} 
        />

        {/*SEGUNDA PARTE, TARJETAS (Aparecen juntas al terminar la intro)*/}
        {part1Finished && (previewData || spotifyData) && (
          <div className="fade-in-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {previewData && <PreviewCard data={previewData} />}
            {spotifyData && <SpotifyCard data={spotifyData} />}
          </div>
        )}

        {/*TERCERA PARTE, DETALLES*/}
        {part1Finished && detailsText && (
          <div style={{ marginTop: '5px' }}>
             <Typewriter text={detailsText} speed={15} />
          </div>
        )}

      </div>
    </div>
  );
}