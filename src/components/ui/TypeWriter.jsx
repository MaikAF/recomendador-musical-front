import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Typewriter = ({ text, speed = 15, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Control de tipeo
  useEffect(() => {
    // Reiniciar si cambia el texto
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
      // Notificar término
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete]);


  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

export default Typewriter;
