import { useScrollFade } from '../hooks/useScrollFade';
import '../css/problem.css';

export default function Problem() {
  console.log('🔄 Problem component rendering...');
  
  const [headingRef, headingStyle] = useScrollFade({
    fadeIntensity: 0.8,
    blurIntensity: 0.15,
    scaleIntensity: 0.03,
    parallaxFactor: 0.08,
    effectZone: 400
  });

  console.log('📦 Style dari hook:', headingStyle);

  return (
    <section className="problem-section flex items-center justify-center min-h-screen w-full">
      <h2
        ref={headingRef}
        style={{
          ...headingStyle,
          // Style fallback jika ada masalah
          color: headingStyle.opacity === undefined ? 'red' : undefined
        }}
        className="problem-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-center leading-tight max-w-5xl mx-auto"
      >
        Bisnismu punya<br />punya <span style={{ color: 'var(--blue)' }}>masalah</span> ini?
      </h2>
    </section>
  );
}