import { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/SideBar';
import ChatArea from './components/ChatArea';
import FeedbackModal from './components/modals/feedbackmodal';
import SettingsModal from './components/modals/settingsmodal';
import AuthModal from './components/modals/authmodal';
import { Menu } from 'lucide-react';

function App() {
  // Hook useChat para manejar la lógica del chat y autenticación
  const { 
    userId, userName, conversationId, messages, chatHistoryList, isLoading,
    sendMessage, loadConversation, handleNewChat, handleDeleteChat, handleLogin, handleLogout, 
    setChatHistoryList, setMessages, setConversationId, clearHistory  
  } = useChat();

  console.log("🟡 [App.jsx] Estado de handleLogin:", typeof handleLogin);

  // Estados de UI 
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Efecto para abrir AuthModal si no hay usuario 
  useEffect(() => {
    if (!userId && !localStorage.getItem('user_session_id')) {
        const params = new URLSearchParams(window.location.search);
        if (!params.get('uid')) {
            setIsAuthOpen(true);
        }
    }
  }, [userId]);

  return (
    <div className="app-container">
      {/* Botón Hamburguesa Visible solo en móvil por CSS */}
      <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Overlay Oscuro para Cerrar en Móvil */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay visible" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        userId={userId}
        chatHistoryList={chatHistoryList}
        conversationId={conversationId}
        onNewChat={handleNewChat}
        onLoadChat={loadConversation}
        onDeleteChat={handleDeleteChat}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ChatArea 
        messages={messages}
        isLoading={isLoading}
        userId={userId}
        onSendMessage={sendMessage}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Modales */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin ={handleLogin} />
      
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        userId={userId} 
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userId={userId} 
        userName={userName}
        onLogout={handleLogout} 
        onClearHistory={clearHistory} 
      />
    </div>
  );
}

export default App;