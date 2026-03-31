import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Music, User, Bot, Loader2 } from 'lucide-react';
import BotMessage from './ui/BotMessage';
import MessageSkeleton from './ui/MessageSkeleton';

export default function ChatArea({ messages, isLoading, userId, onSendMessage, onOpenFeedback }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-area">
      <div className="messages-container">
        <div className="content-wrapper">
          

    {/* Estado Vacío */}
    {messages.length === 0 && (
        <div className="welcome-box">
            <Music size={72} color="#00FF94" style={{ marginBottom: '20px' }} />
            
            <p className="welcome-title">Bienvenido!</p>
            
            <p className="welcome-text">
                Este es un chat de IA para recomendaciones musicales.
            </p>
            
            <p className="welcome-text" style={{ fontSize: '1rem', color: '#999' }}>
                Cuéntame si buscas algo en concreto o cómo te sientes actualmente.
                Yo te ayudaré a encontrar la música perfecta para ti.

            </p>
        </div>
    )}
              
          {/* Lista de Mensajes */}
          {messages.map((msg, i) => {
            const isHistory = msg.isHistory || i < messages.length - 1;
            
            if (msg.sender === 'user') {
              return (
                <div key={i} className="msg-row user">
                  <div className="avatar user"><User size={18} color="white"/></div>
                  <div className="msg-bubble user"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                </div>
              );
            } else {
              return (
                <BotMessage 
                  key={i} 
                  text={msg.text} 
                  spotifyData={msg.spotifyData} 
                  previewData={msg.previewData}
                  isHistory={isHistory} 
                />
              );
            }
          })}
          
          {/* Skeleton de carga */}
          {isLoading && <MessageSkeleton />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-box">
          <input 
            type="text" className="input-field"
            value={input} onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Escribe tu mensaje..." 
            disabled={isLoading || !userId}
          />
          <button 
            onClick={handleSubmit} 
            disabled={isLoading || !input.trim()} 
            className={`btn btn-send ${input.trim() ? 'active' : 'inactive'}`}
          >
            <Send color="white" size={20} />
          </button>
          <button 
            onClick={onOpenFeedback} disabled={!userId} 
            className="btn btn-icon" title="Dar Feedback"
          >
            ⭐
          </button>
        </div>

        <p style={{
            textAlign: 'center',
            fontSize: '0.7rem',     
            color: 'rgba(255, 255, 255, 0.4)', 
            marginTop: '8px',
            marginBottom: '0'
        }}>
            Songyapper puede cometer errores. No tomes sus respuestas como la verdad absoluta.
        </p>

      </div>
    </div>
  );
}
