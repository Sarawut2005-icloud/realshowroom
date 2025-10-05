import { useEffect, useState } from 'react';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export const useEasterEgg = () => {
  const [activated, setActivated] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = [...prev, e.key].slice(-10);
        
        if (newKeys.join(',') === KONAMI_CODE.join(',')) {
          setActivated(true);
          setTimeout(() => setActivated(false), 10000);
          return [];
        }
        
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return activated;
};
