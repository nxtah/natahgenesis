import { useEffect, useRef } from "react"
import "../css/hero.css"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)


const Hero = () => {
  const ref = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

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

      <div className="hero-left" ref={leftRef} style={{ willChange: 'transform' }}>
        <h1 className="font-heading">
          <span className="hero-left-line">Solusi&nbsp;</span>
          <span className="hero-left-line">digitalisasi bisnis</span>
        </h1>
      </div>

      <div className="hero-right" ref={rightRef} style={{ willChange: 'transform' }}>
        <h1 className="font-heading">Dengan Website + AI 24/7</h1>
      </div>

      <div className="hero-scroll hidden sm:block">
        <h3 className="font-body">Scroll untuk kembangkan bisnis anda</h3>
      </div>
    </section>
  )
}

export default Hero
