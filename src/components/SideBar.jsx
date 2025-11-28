import React from 'react';
import { Plus, MessageSquare, Trash2, Music, User, Settings } from 'lucide-react';

export default function Sidebar({ 
    userId, chatHistoryList, conversationId, 
    onNewChat, onLoadChat, onDeleteChat, 
    onOpenAuth, onOpenSettings 
}) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-header">
        <Music color="#00FF94" /> Asistente IA
      </h2>

      {userId && (
        <button onClick={onNewChat} className="btn btn-primary">
          <Plus size={18} /> Nuevo Chat
        </button>
      )}

      <div className="chat-list">
        <p style={{ color: '#666', fontSize: '0.8rem', paddingLeft: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Historial</p>
        {chatHistoryList.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => onLoadChat(chat.id)}
            className={`chat-item ${conversationId === chat.id ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <MessageSquare size={16} /> 
              <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem'}}>
                {chat.resumen}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
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
          <button onClick={onOpenAuth} className="btn btn-spotify">
            <Music size={18} /> Conectar Spotify
          </button>
        ) : (
          <button onClick={onOpenSettings} className="btn btn-account">
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
  );
}