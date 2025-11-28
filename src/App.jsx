import { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/SideBar';
import ChatArea from './components/ChatArea';
import FeedbackModal from './components/modals/FeedbackModal';
import SettingsModal from './components/modals/SettingsModal';
import AuthModal from './components/modals/AuthModal';

function App() {
  // 1. Usamos el Hook Maestro
  const { 
    userId, conversationId, messages, chatHistoryList, isLoading,
    sendMessage, loadConversation, handleNewChat, handleDeleteChat, handleLogout, 
    setChatHistoryList, setMessages, setConversationId, clearHistory
  } = useChat();

  // 2. Estados de UI (Modales) - Esto es visual, se queda aquí
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
      
      <Sidebar 
        userId={userId}
        chatHistoryList={chatHistoryList}
        conversationId={conversationId}
        onNewChat={handleNewChat}
        onLoadChat={loadConversation}
        onDeleteChat={handleDeleteChat}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ChatArea 
        messages={messages}
        isLoading={isLoading}
        userId={userId}
        onSendMessage={sendMessage}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Modales */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        userId={userId} 
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userId={userId} 
        onLogout={handleLogout} 
        onClearHistory={clearHistory} 
      />
    </div>
  );
}

export default App;