import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Music, User, Bot, Loader2, MessageSquare, Plus, Settings, Trash2} from 'lucide-react';
import FeedbackModal from './feedbackmodal';
import SettingsModal from './settingsmodal';
import AuthModal from './authmodal';
import SpotifyCard from './spotifycard';
import BotMessage from './botmessage';
import MessageSkeleton from './messageskeleton';

function App() {
  // Estados Principales
  const [userId, setUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Estados de Interfaz
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistoryList, setChatHistoryList] = useState([]); // Lista para el sidebar
  
  // Modales
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);


  // 1. Carga Inicial y Login
 useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidFromUrl = params.get('uid');
    
    // Buscar la sesión almacenada localmente
    const storedUserId = localStorage.getItem('user_session_id');

    let currentUserId = null;

    if (uidFromUrl) {
      // Caso A: Usuario vuelve de Spotify (Sesión nueva o reestablecida)
      currentUserId = uidFromUrl;
      localStorage.setItem('user_session_id', uidFromUrl); // GUARDAMOS la sesión
      window.history.replaceState({}, document.title, "/"); // Limpiar URL
      
    } else if (storedUserId) {
      // Caso B: El usuario simplemente recargó la página (Sesión persistente)
      currentUserId = storedUserId;
    }

    if (currentUserId) {
      setUserId(currentUserId);
      fetchConversations(currentUserId);
      setIsAuthOpen(false); // Aseguramos que el modal esté cerrado
    } else {
      // Caso C: No hay UID en URL ni en LocalStorage (No hay sesión)
      setIsAuthOpen(true); // Abrir modal
    }
  }, []);

  // 2. Funciones de API
  const fetchConversations = async (uid) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/conversations/${uid}`);
      setChatHistoryList(res.data.summaries);
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  const loadConversation = async (convId) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Cargar mensajes antiguos
      const res = await axios.get(`http://127.0.0.1:8000/history/${userId}/${convId}`);
      setConversationId(convId);
      // Mapeamos el formato de la DB al formato del Frontend
      const formattedMsgs = res.data.messages.map(m => ({
        sender: m.role,
        text: m.text
      }));
      setMessages(formattedMsgs);
    } catch (error) {
      console.error("Error cargando chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/login');
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Evita que se abra el chat al hacer click en borrar
    if (!confirm("¿Borrar este chat?")) return;

    try {
        await axios.delete(`http://127.0.0.1:8000/conversations/${userId}/${chatId}`);
        // Actualizar la lista visualmente
        setChatHistoryList(prev => prev.filter(chat => chat.id !== chatId));
        // Si borramos el chat actual, limpiar la pantalla
        if (conversationId === chatId) {
            setConversationId(null);
            setMessages([]);
        }
    } catch (error) {
        console.error("Error borrando chat:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session_id');
    setUserId(null);
    setMessages([]);
    setChatHistoryList([]);
    setConversationId(null);
    window.history.replaceState({}, document.title, "/");
    // Opcional: Limpiar localStorage si lo usas
  };

  const handleNewChat = async () => {
      if (!userId) return;
      try {
          const res = await axios.post('http://127.0.0.1:8000/new_chat', { user_id: userId });
          setConversationId(res.data.conversation_id);
          setMessages([{ sender: 'bot', text: '¡Nuevo chat iniciado! ¿Qué música exploramos hoy?' }]);
          fetchConversations(userId); // Actualizar lista
      } catch (error) {
          alert("Error: " + (error.response?.data?.detail || "No se pudo crear chat"));
      }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: userText,
        user_id: userId || "anonymous",
        conversation_id: conversationId
      });

      setMessages(prev => [...prev, { 
      sender: 'bot', 
      text: response.data.response,
      spotifyData: response.data.spotify_data 
      }]);

      if (!conversationId) {
        setConversationId(response.data.conversation_id);
        fetchConversations(userId); // Refrescar lista si era chat nuevo
      }
    } catch (error) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Error al conectar con el servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render
return (
    <div className="app-container">
      
      {/* --- BARRA LATERAL --- */}
      <div className="sidebar">
        
        <h2 className="sidebar-header">
          <Music color="#00FF94" /> Asistente IA
        </h2>

        {userId && (
            <button onClick={handleNewChat} className="btn btn-primary">
                <Plus size={18} /> Nuevo Chat
            </button>
        )}

        <div className="chat-list">
            <p style={{ color: '#666', fontSize: '0.8rem', paddingLeft: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Historial</p>
            {chatHistoryList.map((chat) => (
                <div 
                    key={chat.id}
                    onClick={() => loadConversation(chat.id)}
                    className={`chat-item ${conversationId === chat.id ? 'active' : ''}`}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <MessageSquare size={16} /> 
                        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem'}}>
                            {chat.resumen}
                        </span>
                    </div>
                    <button 
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }}
                        title="Borrar chat"
                    >
                        <Trash2 size={14} className="hover:text-red-500" />
                    </button>
                </div>
            ))}
        </div>

        <div className="footer-area">
            {!userId ? (
                <button onClick={() => setIsAuthOpen(true)} className="btn btn-spotify">
                    <Music size={18} /> Conectar Spotify
                </button>
            ) : (
                <button onClick={() => setIsSettingsOpen(true)} className="btn btn-account">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar user" style={{width: 30, height: 30}}>
                            <User size={16} color="white"/>
                        </div>
                        <span style={{ fontSize: '0.9rem' }}>Mi Cuenta</span>
                    </div>
                    <Settings size={18} color="#666" />
                </button>
            )}
        </div>
      </div>

      {/* --- ÁREA DE CHAT --- */}
      <div className="chat-area">
         
         <div className="messages-container">
            <div className="content-wrapper">
                
                {/* Estado Vacío */}
                {messages.length === 0 && (
                    <div className="empty-state">
                        <Music size={64} color="#333" />
                        <p>Selecciona un chat o inicia uno nuevo.</p>
                    </div>
                )}
                
                {/* Mensajes */}
                {messages.map((msg, i) => {
              
                    // Si tiene la bandera isHistory O si no es el último mensaje de la lista, lo tratamos como historial.
                    const isHistory = msg.isHistory || i < messages.length - 1;

                    if (msg.sender === 'user') {
                        //MENSAJE DEL USUARIO 
                        return (
                            <div key={i} className="msg-row user">
                                <div className="avatar user">
                                    <User size={18} color="white"/>
                                </div>
                                <div className="msg-bubble user">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        );
                    } else {
                        // MENSAJE DEL BOT 
                        return (
                            <BotMessage 
                                key={i}
                                text={msg.text}
                                spotifyData={msg.spotifyData}
                                isHistory={isHistory} 
                            />
                        );
                    }
                })}
                
                {/* Loading */}
                {isLoading && (
                    <MessageSkeleton />
                )}
            </div>
         </div>

         {/* Input */}
         <div className="input-container">
            <div className="input-box">
                <input 
                    type="text" 
                    className="input-field"
                    value={input} onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe tu mensaje..." 
                    disabled={isLoading || !userId}
                />
                
                <button 
                    onClick={sendMessage} 
                    disabled={isLoading || !input.trim()} 
                    className={`btn btn-send ${input.trim() ? 'active' : 'inactive'}`}
                >
                    <Send color="white" size={20} />
                </button>
                
                <button 
                    onClick={() => setIsFeedbackOpen(true)} 
                    disabled={!userId} 
                    className="btn btn-icon"
                    title="Dar Feedback"
                >
                    ⭐
                </button>
            </div>
         </div>

      </div>

      {/* Modales */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userId={userId} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userId={userId} 
        onLogout={handleLogout} 
        onHistoryCleared={() => { setChatHistoryList([]); setMessages([]); setConversationId(null); }} 
      />
    </div>
  );
}

export default App;