import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Music, User, Bot, Loader2 } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy tu asistente musical. Conecta tu cuenta de Spotify para comenzar o pregúntame algo sobre música.' }
  ]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Efecto para capturar el User ID de la URL tras el login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');
    if (uid) {
      setUserId(uid);
      // Limpiamos la URL para que se vea limpia
      window.history.replaceState({}, document.title, "/");
      setMessages(prev => [...prev, { sender: 'bot', text: '¡Conexión con Spotify exitosa! Analizaré tus gustos para darte mejores recomendaciones. ¿Qué quieres escuchar hoy?' }]);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/login');
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error iniciando login:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (isLoading) return;

    const userText = input;
    setInput(''); // Limpiar input inmediatamente
    
    // Agregar mensaje del usuario al chat
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true); // Activar estado de carga (Latencia percibida)

    try {
      // 2. Petición al Backend
      const response = await axios.post('http://localhost:8000/chat', {
        message: userText,
        user_id: userId || "anonymous" // Enviamos el ID si existe
      });

      // Agregar respuesta del bot
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, tuve un problema conectando con el servidor.' }]);
      console.error("Error en chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Permitir enviar con la tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      {/* Barra Lateral */}
      <div style={{ width: '260px', background: '#000', padding: '20px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Music color="#00FF94" /> Asistente IA
        </h2>
        
        {!userId ? (
          <button onClick={handleLogin} style={{ backgroundColor: '#00FF94', color: '#000', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.3s' }}>
            <Music size={18} /> Conectar Spotify
          </button>
        ) : (
          <div style={{ padding: '10px', background: '#282828', borderRadius: '8px', color: '#00FF94', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={18} /> Sesión Activa
          </div>
        )}
      </div>

      {/* Área de Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
                display: 'flex', 
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{ 
                  display: 'flex',
                  gap: '10px',
                  maxWidth: '75%',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                {/* Avatar */}
                <div style={{ 
                  width: '35px', height: '35px', borderRadius: '50%', 
                  background: msg.sender === 'user' ? '#8B5CF6' : '#282828',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {msg.sender === 'user' ? <User size={18} color="white"/> : <Bot size={18} color="#00FF94"/>}
                </div>

                {/* Burbuja de Texto */}
                <div style={{ 
                    background: msg.sender === 'user' ? 'transparent' : '#282828', 
                    border: msg.sender === 'user' ? '1px solid #8B5CF6' : 'none',
                    padding: '12px 18px', 
                    borderRadius: '12px',
                    color: '#e0e0e0',
                    lineHeight: '1.5'
                }}>
                  {/* 3. Renderizado de Markdown */}
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Indicador de "Escribiendo..." para mitigar percepción de latencia */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '10px' }}>
               <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#00FF94"/>
               </div>
               <div style={{ background: '#282828', padding: '12px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                  <Loader2 className="animate-spin" size={20} color="#00FF94" style={{animation: 'spin 1s linear infinite'}} />
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
          <div style={{ display: 'flex', gap: '10px', background: '#282828', padding: '8px', borderRadius: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ej: Recomiéndame algo similar a The Strokes..." 
              style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1rem' }}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              style={{ background: input.trim() ? '#8B5CF6' : '#444', border: 'none', borderRadius: '8px', width: '50px', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
            >
              <Send color="white" size={20} />
            </button>
          </div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginTop: '10px' }}>
            Powered by Gemini & Spotify
          </div>
        </div>
      </div>
      
      {/* Estilo simple para la animación de rotación */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;