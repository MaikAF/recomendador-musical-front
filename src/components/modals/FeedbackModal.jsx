import { useState } from 'react';
import { Star, X, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, userId, onSend }) {
  const [rating, setRating] = useState(0);
  const [pleasant, setPleasant] = useState(null); // true/false
  const [motivated, setMotivated] = useState(null); // true/false
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return alert("Por favor califica con estrellas");
    
    setIsSubmitting(true);
    const result = await onSend({
      rating: rating,
      pleasant_interaction: pleasant === true,
      motivated_exploration: motivated === true,
      comments: comments
    });

    if (result.success) {
      alert("¡Gracias por tu opinión!");
      onClose();
    } else {

      alert("Error al enviar. Intenta nuevamente."); 
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#282828', padding: '30px', borderRadius: '15px', width: '400px',
        color: 'white', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <X />
        </button>

        <h3 style={{ marginTop: 0, textAlign: 'center' }}>Califica tu recomendación</h3>

        {/* Estrellas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={32} 
              fill={star <= rating ? "#00FF94" : "none"} 
              color={star <= rating ? "#00FF94" : "#666"}
              style={{ cursor: 'pointer' }}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Pregunta 1 */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>¿La interacción fue agradable?</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => setPleasant(true)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: pleasant === true ? '#00FF94' : '#444', color: pleasant === true ? 'black' : 'white', display: 'flex', justifyContent: 'center' }}>
              <ThumbsUp size={18} />
            </button>
            <button 
               onClick={() => setPleasant(false)}
               style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: pleasant === false ? '#FF4444' : '#444', color: 'white', display: 'flex', justifyContent: 'center' }}>
              <ThumbsDown size={18} />
            </button>
          </div>
        </div>

        {/* Pregunta 2 */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>¿Te motivó a explorar música?</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setMotivated(true)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: motivated === true ? '#00FF94' : '#444', color: motivated === true ? 'black' : 'white' }}>Sí</button>
            <button onClick={() => setMotivated(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: motivated === false ? '#FF4444' : '#444', color: 'white' }}>No</button>
          </div>
        </div>

        {/* Comentarios */}
        <textarea 
          placeholder="Comentarios adicionales..." 
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          style={{ width: '100%', height: '80px', backgroundColor: '#121212', border: 'none', borderRadius: '8px', color: 'white', padding: '10px', marginBottom: '20px', resize: 'none' }}
        />

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #444', background: 'transparent', color: 'white', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#8B5CF6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}
