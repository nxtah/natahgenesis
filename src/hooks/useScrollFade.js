import { useState, useEffect, useRef, useCallback } from 'react';

const useScrollFade = (options = {}) => {
  const targetRef = useRef(null);
  const [style, setStyle] = useState({ 
    opacity: 1, 
    filter: 'blur(0px)',
    transform: 'translateZ(0)'
  });
  const frameId = useRef(null);
  const isFirstCalculation = useRef(true);
  
  const { 
    fadeIntensity = 0.7, 
    blurIntensity = 0.2, 
    effectZone = 300 
  } = options;

  const updateStyle = useCallback(() => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
    
    frameId.current = requestAnimationFrame(() => {
      const element = targetRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      const rawDistance = Math.abs(elementCenter - viewportCenter);
      const deadZone = 150;
      const distance = Math.max(0, rawDistance - deadZone);
      
      const intensity = Math.min(distance / effectZone, 1);
      const opacity = 1 - (intensity * fadeIntensity);
      const blurValue = (intensity * blurIntensity * 10).toFixed(2);
      const blur = `${blurValue}px`;

      const newStyle = {
        opacity: Math.max(opacity, 0),
        filter: `blur(${blur})`,
        transform: 'translateZ(0)',
        // Hanya pakai transition setelah kalkulasi pertama selesai
        transition: isFirstCalculation.current ? 'none' : 'opacity 0.1s linear, filter 0.1s linear'
      };

      setStyle(newStyle);
      
      // Set flag setelah kalkulasi pertama
      if (isFirstCalculation.current) {
        isFirstCalculation.current = false;
      }
    });
  }, [fadeIntensity, blurIntensity, effectZone]);

  // Force update dengan berbagai metode
  const forceUpdate = useCallback(() => {
    // Method 1: Immediate call
    updateStyle();
    
    // Method 2: Double RAF (paling reliable)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateStyle();
      });
    });
    
    // Method 3: Triple RAF untuk extra safety
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateStyle();
        });
      });
    });
  }, [updateStyle]);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    // Reset flag setiap mount
    isFirstCalculation.current = true;

    // Event Listeners
    const handleScroll = () => updateStyle();
    const handleResize = () => updateStyle();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('load', forceUpdate);

    // Intersection Observer - trigger saat elemen visible
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            forceUpdate();
          }
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1] }
    );
    intersectionObserver.observe(element);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      forceUpdate();
    });
    resizeObserver.observe(element);

    // Mutation Observer - detect DOM changes
    const mutationObserver = new MutationObserver(() => {
      forceUpdate();
    });
    mutationObserver.observe(element, {
      attributes: true,
      childList: true,
      subtree: true
    });

    // AGGRESSIVE INITIAL UPDATES dengan berbagai delay
    const timeouts = [
      setTimeout(forceUpdate, 0),      // Immediately
      setTimeout(forceUpdate, 16),     // 1 frame
      setTimeout(forceUpdate, 32),     // 2 frames
      setTimeout(forceUpdate, 50),     // 3 frames
      setTimeout(forceUpdate, 100),    // Safe delay
      setTimeout(forceUpdate, 200),    // Medium delay
      setTimeout(forceUpdate, 400),    // Long delay
      setTimeout(forceUpdate, 800),    // Extra long
      setTimeout(forceUpdate, 1200),   // Super safe
    ];

    // Initial force update
    forceUpdate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', forceUpdate);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      timeouts.forEach(clearTimeout);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [updateStyle, forceUpdate]);

  return [targetRef, style];
};

export { useScrollFade };