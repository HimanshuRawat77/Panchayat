import React, { useState, useEffect } from 'react';

export const Typewriter = ({ 
  words = [], 
  speed = 100, 
  delayBetweenWords = 2000, 
  cursor = true, 
  cursorChar = '|' 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const currentFullWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(currentFullWord.substring(0, currentText.length + 1));
        
        if (currentText === currentFullWord) {
          // Finished typing, wait before deleting
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      } else {
        // Deleting
        setCurrentText(currentFullWord.substring(0, currentText.length - 1));
        
        if (currentText.length === 0) {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delayBetweenWords]);

  return (
    <span>
      {currentText}
      {cursor && <span className="animate-pulse">{cursorChar}</span>}
    </span>
  );
};
