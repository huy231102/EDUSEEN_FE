import { useState, useEffect } from 'react';

// Hook tiện ích giúp đồng bộ state với localStorage
const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (err) {
      console.error('Failed to parse localStorage key', key, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to set localStorage key', key, err);
    }
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorage; 