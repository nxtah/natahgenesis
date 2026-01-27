// File: src/hooks/useEventListener.js
import { useEffect, useRef } from 'react';

const useEventListener = (eventType, callback, element = window) => {
  const callbackRef = useRef(callback);
  
  // Update callback ref saat callback berubah
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    if (!element) return;
    
    const handler = (e) => callbackRef.current(e);
    element.addEventListener(eventType, handler);
    
    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
};

export { useEventListener };