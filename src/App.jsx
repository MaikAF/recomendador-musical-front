import { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/SideBar';
import ChatArea from './components/ChatArea';
import FeedbackModal from './components/modals/FeedbackModal';
import SettingsModal from './components/modals/SettingsModal';
import AuthModal from './components/modals/AuthModal';
import { Menu } from 'lucide-react';

function App() {
  const { 
    userId, userName, conversationId, messages, chatHistoryList, isLoading,
    sendMessage, loadConversation, handleNewChat, handleDeleteChat, handleLogin, handleLastFMLogin, handleYTMusicLogin, handleLogout, 
    setChatHistoryList, setMessages, setConversationId, clearHistory, sendFeedback
  } = useChat();

  console.log("🟡 [App.jsx] Estado de handleLogin:", typeof handleLogin);

  // 2. Estados de UI (Modales) - Esto es visual, se queda aquí
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

      <button 
        className="menu-toggle-btn btn-icon" 
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>
      
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
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin ={handleLogin} onLastFMLogin={handleLastFMLogin} onYTMusicLogin={handleYTMusicLogin} />
      
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        userId={userId} 
        onSend={sendFeedback}
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