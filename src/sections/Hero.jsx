import { useEffect, useRef } from "react"
import "../css/hero.css"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import '../css/button-liquid-glass.css';

gsap.registerPlugin(ScrollTrigger)


const Hero = () => {
  const ref = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  // Robust scroll handler to Section 7 (works on mobile and desktop)
  const handleScrollToSection7 = (e) => {
    e && e.preventDefault();
    const section7 = document.getElementById('section7');
    if (!section7) {
      // fallback: update hash to jump
      window.location.hash = '#section7';
      return;
    }

    // Calculate absolute position and scroll smoothly
    const rect = section7.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = Math.max(0, rect.top + scrollTop - 8); // small offset

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  useEffect(() => {
    let st = null;
    if (ref.current && leftRef.current && rightRef.current) {
      st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        pinSpacing: false, // Allows the next section to overlap while pinning
        onUpdate: (self) => {
          // progress: 0 (awal), 1 (akhir)
          const progress = self.progress;
          // LEFT: X dari 0% (kiri) ke 50% (tengah)
          // RIGHT: X dari 0% (kanan) ke -50% (tengah)
          const leftX = progress * 50; // 0 -> 50%
          const rightX = -progress * 50; // 0 -> -50%
          // Animasi smooth dengan GSAP
          gsap.to(leftRef.current, {
            xPercent: leftX,
            yPercent: -50,
            duration: 0.06,
            ease: "power2.out"
          });
          gsap.to(rightRef.current, {
            xPercent: rightX,
            yPercent: -50,
            duration: 0.06,
            ease: "power2.out"
          });
        },
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
    }
    ScrollTrigger.refresh();
    return () => {
      st && st.kill();
    }
  }, []);

  return (
    <section ref={ref} className="hero min-h-screen w-full bg-transparent" id="hero" data-theme="dark">
      {/* Sentinel for navbar scroll detection (small invisible marker ~12% from top) */}
      <div id="hero-sentinel" className="hero-sentinel" aria-hidden="true" />


      {/* Desktop: flex row, Mobile: stack vertically (handled by CSS) */}
      {/* Restore original stacking: no flex row wrapper, let .hero CSS handle layout */}
      <div className="hero-left" ref={leftRef} style={{ willChange: 'transform' }}>
        <h1 className="font-heading">
          <span className="hero-left-line">Solusi&nbsp;</span>
          <span className="hero-left-line">digitalisasi bisnis</span>
        </h1>
      </div>

      {/* Liquid Glass Button - only show on desktop */}
      <div className="hero-center-btn hidden lg:flex flex-col items-center justify-center px-8" style={{zIndex: 5}}>
        <button
          className="liquid-glass-btn font-montreal"
          onClick={handleScrollToSection7}
          type="button"
        >
          Mulai Sekarang
        </button>
      </div>

      <div className="hero-right" ref={rightRef} style={{ willChange: 'transform' }}>
        <h1 className="font-heading">Dengan Website + AI 24/7</h1>
      </div>

      {/* Mobile-only button: below hero text */}
      <div className="hero-center-btn-mobile block lg:hidden w-full flex justify-center mt-6">
        <button
          className="liquid-glass-btn font-montreal"
          onClick={handleScrollToSection7}
          type="button"
        >
          Mulai Sekarang
        </button>
      </div>

      <div className="hero-scroll hidden sm:block">
        <h3 className="font-body">Scroll untuk kembangkan bisnis anda</h3>
      </div>
    </section>
  )
}

export default Hero
