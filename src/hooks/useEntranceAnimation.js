import { useState, useEffect, useRef } from 'react';

const useEntranceAnimation = (options = {}) => {
  const targetRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false); // Flag agar tidak repeat

  const {
    fadeDistance = 30,    // Pixels untuk slide up
    fadeDuration = 0.6,   // Durasi animasi (detik)
    blurAmount = 5,       // Blur awal (pixels)
    delay = 0,            // Delay sebelum animasi (detik)
    threshold = 0.1       // Berapa persen element harus terlihat
  } = options;

  useEffect(() => {
    const element = targetRef.current;
    if (!element || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika element masuk viewport DAN belum pernah dianimasikan
        if (entry.isIntersecting && !hasAnimated.current) {
          console.log('🎬 Triggering entrance animation');
          hasAnimated.current = true;
          
          // Delay jika ada
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
          
          // Stop observing setelah trigger
          observer.unobserve(element);
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger sedikit sebelum tepat di viewport
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [delay, threshold]);

  // Style berdasarkan state isVisible
  const style = {
    opacity: isVisible ? 1 : 0,
    filter: isVisible ? 'blur(0px)' : `blur(${blurAmount}px)`,
    transform: isVisible 
      ? 'translateY(0)' 
      : `translateY(${fadeDistance}px)`,
    transition: `all ${fadeDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    willChange: 'opacity, transform, filter'
  };

  return [targetRef, style, isVisible];
};

export { useEntranceAnimation };