import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Typewriter = ({ text, speed = 15, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para manejar el tipeo progresivo
  useEffect(() => {
    // Si el texto prop cambia drásticamente (nueva respuesta), reiniciamos
    if (text && currentIndex === 0) {
        setDisplayedText('');
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Cuando termina de escribir todo el texto
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete]);

  // Renderizamos con Markdown para que se vean las negritas/cursivas mientras escribe
  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default Typewriter;
