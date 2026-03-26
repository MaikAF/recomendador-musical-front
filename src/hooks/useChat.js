import { useState, useEffect } from 'react';
import axios from 'axios';

// Definimos la URL base (ajustable por variable de entorno)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
console.log("🟢 [useChat] API_URL configurada como:", API_URL);


export function useChat() {
  const [userId, setUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
      console.log("🟢 [useChat] Hook inicializado correctamente.");
  }, []);

  const fetchUserProfile = async (uid) => {
      try {
          const res = await axios.get(`${API_URL}/user/${uid}`);
          if (res.data.display_name) {
              setUserName(res.data.display_name);
          }
      } catch (e) { console.error(e); }
  };

  // Carga Inicial
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidFromUrl = params.get('uid');
    const storedUserId = localStorage.getItem('user_session_id');

    let activeUserId = null;

    if (uidFromUrl) {
      // Caso A: Login nuevo
      activeUserId = uidFromUrl;
      localStorage.setItem('user_session_id', uidFromUrl);
      window.history.replaceState({}, document.title, "/");
    } else if (storedUserId) {
      // Caso B: Recarga de página
      activeUserId = storedUserId;
    }

    // Lógica unificada
    if (activeUserId) {
      setUserId(activeUserId);
      fetchConversations(activeUserId);
      fetchUserProfile(activeUserId); 
    }
  }, []);

  // Acciones de API
  const fetchConversations = async (uid) => {
    try {
      const res = await axios.get(`${API_URL}/conversations/${uid}`);
      setChatHistoryList(res.data.summaries);
    } catch (error) { console.error("Error historial:", error); }
  };

  const loadConversation = async (convId) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history/${userId}/${convId}`);
      setConversationId(convId);
      const formattedMsgs = res.data.messages.map(m => ({
        sender: m.role, text: m.text, isHistory: true
      }));
      setMessages(formattedMsgs);
    } catch (error) { console.error("Error carga chat:", error); }
    finally { setIsLoading(false); }
  };

  // --- AQUÍ ESTABA EL FALTANTE: FUNCIÓN handleLogin ---
const handleLogin = async () => {
    console.log("🟢 [useChat] SE LLAMÓ A handleLogin() DESDE EL HOOK"); 
    try {
      const targetUrl = `${API_URL}/login`;
      console.log("🟢 [useChat] Consultando endpoint:", targetUrl);
      
      const response = await axios.get(targetUrl);
      console.log("🟢 [useChat] Respuesta URL:", response.data.url);
      
      // Redirección
      window.location.href = response.data.url;
    } catch (error) {
      console.error("🔴 [useChat] Error en handleLogin:", error);
      alert("Error al conectar con el servidor de login.");
    }
  };
  // ----------------------------------------------------

// --- NUEVA FUNCIÓN: LOGIN CON LAST.FM ---
  const handleLastFMLogin = async (username) => {
    if (!username || !username.trim()) return { success: false, message: "El usuario no puede estar vacío" };
    
    setIsLoading(true);
    try {
        console.log("🟢 [useChat] Conectando usuario de Last.FM:", username);
        const res = await axios.post(`${API_URL}/login/lastfm`, {
            lastfm_username: username
        });

        if (res.data.status === "success") {
            const internalUserId = res.data.user_id;
            
            // Replicamos el flujo de éxito (Caso A)
            localStorage.setItem('user_session_id', internalUserId);
            setUserId(internalUserId);
            setUserName(res.data.display_name);
            fetchConversations(internalUserId);
            
            return { success: true };
        }
    } catch (error) {
        console.error("🔴 [useChat] Error en handleLastFMLogin:", error);
        return { success: false, message: "Error al conectar con el servidor." };
    } finally {
        setIsLoading(false);
    }
  };
  // ----------------------------------------------------
  
  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: text, isHistory: false }]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: text,
        user_id: userId || "anonymous",
        conversation_id: conversationId
      });

      if (!conversationId) {
        setConversationId(res.data.conversation_id);
        fetchConversations(userId);
      }

      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: res.data.response, 
        spotifyData: res.data.spotify_data,
        isHistory: false
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error de conexión.', isHistory: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
      setConversationId(null);
      setMessages([{ sender: 'bot', text: '¡Nuevo chat iniciado! ¿Qué música exploramos hoy?', isHistory: false }]);
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm("¿Borrar este chat?")) return;
    try {
        await axios.delete(`${API_URL}/conversations/${userId}/${chatId}`);
        setChatHistoryList(prev => prev.filter(chat => chat.id !== chatId));
        if (conversationId === chatId) {
            setConversationId(null);
            setMessages([]);
        }
    } catch (error) { console.error("Error borrando:", error); }
  };

  const clearHistory = async () => {
      if (!confirm("¿Estás seguro de que quieres borrar TODAS tus conversaciones?")) return;
      
      try {
          await axios.delete(`${API_URL}/conversations/${userId}`);
          setChatHistoryList([]);
          setMessages([]);
          setConversationId(null);
          alert("Historial eliminado correctamente.");
      } catch (error) {
          console.error("Error borrando historial:", error);
          alert("Hubo un error al intentar borrar el historial.");
      }
  };

  const sendFeedback = async (data) => {
    if (!userId) return;
    try {
        // Usamos la URL centralizada del hook
        await axios.post(`${API_URL}/feedback`, {
            ...data,
            user_id: userId
        });
        return { success: true };
    } catch (error) {
        console.error("Error enviando feedback (Server):", error);
        return { success: false, message: "Error de red/servidor" };
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('user_session_id');
    setUserId(null);
    setMessages([]);
    setChatHistoryList([]);
    setConversationId(null);
    setUserName(null);
    window.history.replaceState({}, document.title, "/");
  };

  return {
    userId, userName, conversationId, messages, chatHistoryList, isLoading,
    sendMessage, loadConversation, handleNewChat, handleDeleteChat, handleLogout, 
    fetchConversations, setChatHistoryList, setMessages, setConversationId, clearHistory,
    handleLogin, handleLastFMLogin, sendFeedback
  };
}