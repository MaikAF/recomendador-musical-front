import { useState, useEffect } from 'react';
import axios from 'axios';

// Definimos la URL base (ajustable por variable de entorno)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function useChat() {
  const [userId, setUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carga Inicial
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidFromUrl = params.get('uid');
    const storedUserId = localStorage.getItem('user_session_id');

    if (uidFromUrl) {
      localStorage.setItem('user_session_id', uidFromUrl);
      setUserId(uidFromUrl);
      fetchConversations(uidFromUrl);
      window.history.replaceState({}, document.title, "/");
    } else if (storedUserId) {
      setUserId(storedUserId);
      fetchConversations(storedUserId);
    }
  }, []);

  //Acciones de API
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

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    // Optimistic UI Update
    setMessages(prev => [...prev, { sender: 'user', text: text, isHistory: false }]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: text,
        user_id: userId || "anonymous",
        conversation_id: conversationId
      });

      // Si es chat nuevo, guardamos ID y actualizamos sidebar
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
          // 1. Llamada al Backend
          await axios.delete(`${API_URL}/conversations/${userId}`);
          
          // 2. Limpieza Visual Inmediata (Estados)
          setChatHistoryList([]);
          setMessages([]);
          setConversationId(null);
          alert("Historial eliminado correctamente.");
          
      } catch (error) {
          console.error("Error borrando historial:", error);
          alert("Hubo un error al intentar borrar el historial.");
      }
  };



  const handleLogout = () => {
    localStorage.removeItem('user_session_id');
    setUserId(null);
    setMessages([]);
    setChatHistoryList([]);
    setConversationId(null);
    window.history.replaceState({}, document.title, "/");
  };

  return {
    userId, conversationId, messages, chatHistoryList, isLoading,
    sendMessage, loadConversation, handleNewChat, handleDeleteChat, handleLogout, fetchConversations, setChatHistoryList, setMessages, setConversationId, clearHistory
  };

}