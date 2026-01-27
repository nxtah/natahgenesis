import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Problem from "./sections/Problem";
import Services from "./sections/Services";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTransitionSections() {
  const problemRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const problem = problemRef.current;
    const services = servicesRef.current;

    // initial overlay state
    gsap.set(services, {
      position: "fixed",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 0.25,
      opacity: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 100,
      pointerEvents: "none",
      force3D: true,
      willChange: "transform, opacity",
      transformOrigin: "center center",
    });

    // Use ScrollTrigger.matchMedia to provide mobile-specific start/end values
    const mm = ScrollTrigger.matchMedia({
      // Mobile (<= 768px): use longer end and slightly earlier start so the effect is visible
      "(max-width: 768px)": () => {
        // Mobile fallback: pin the Problem section (create a spacer) and animate Services overlay
        let rafId = null;
        let pinned = false;
        let problemPinned = false;
        let spacer = null;
        const prevProblemStyles = {};

        const getStart = () => {
          const rect = problem.getBoundingClientRect();
          return window.scrollY + rect.bottom - window.innerHeight * 0.85; // when bottom crosses ~85% of viewport
        };
        const getLength = () => window.innerHeight * 2.2; // similar to +=220%

        const ensureSpacer = () => {
          if (!spacer) {
            spacer = document.createElement('div');
            spacer.style.width = '100%';
            spacer.style.height = `${problem.offsetHeight}px`;
            problem.parentNode.insertBefore(spacer, problem.nextSibling);
          }
        };

        const removeSpacer = () => {
          if (spacer && spacer.parentNode) spacer.parentNode.removeChild(spacer);
          spacer = null;
        };

        const pinProblem = () => {
          if (problemPinned) return;
          // save previous inline styles to restore
          prevProblemStyles.position = problem.style.position || '';
          prevProblemStyles.top = problem.style.top || '';
          prevProblemStyles.left = problem.style.left || '';
          prevProblemStyles.width = problem.style.width || '';
          prevProblemStyles.zIndex = problem.style.zIndex || '';

          ensureSpacer();
          problem.style.position = 'fixed';
          problem.style.top = '0';
          problem.style.left = '0';
          problem.style.width = '100%';
          problem.style.zIndex = '90';
          problemPinned = true;
        };

        const unpinProblem = () => {
          if (!problemPinned) return;
          problem.style.position = prevProblemStyles.position;
          problem.style.top = prevProblemStyles.top;
          problem.style.left = prevProblemStyles.left;
          problem.style.width = prevProblemStyles.width;
          problem.style.zIndex = prevProblemStyles.zIndex;
          removeSpacer();
          problemPinned = false;
        };

        const update = () => {
          const start = getStart();
          const len = getLength();
          const y = window.scrollY;
          const prog = Math.max(0, Math.min(1, (y - start) / len));

          // Pin problem when progress > 0, unpin when 0
          if (prog > 0 && !problemPinned) {
            pinProblem();
          } else if (prog === 0 && problemPinned) {
            unpinProblem();
          }

          // Pin services overlay visually while problem is pinned
          if (prog > 0 && !pinned) {
            gsap.set(services, {
              position: 'fixed',
              top: '50%',
              left: '50%',
              xPercent: -50,
              yPercent: -50,
              width: '100vw',
              height: '100vh',
              zIndex: 100,
              pointerEvents: 'none',
              force3D: true,
              willChange: 'transform, opacity',
            });
            pinned = true;
          } else if (prog <= 0 && pinned) {
            gsap.set(services, {
              position: 'relative',
              top: 'auto',
              left: 'auto',
              xPercent: 0,
              yPercent: 0,
              zIndex: 'auto',
              pointerEvents: 'none',
            });
            pinned = false;
          }

          // drive animation (scale from 0.25 -> 1, opacity 0 -> 1)
          const s = 0.25 + 0.75 * prog;
          const o = prog;
          gsap.set(services, { scale: s, opacity: o });
          services.style.pointerEvents = prog > 0.98 ? 'auto' : 'none';
        };

        const onScroll = () => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', update, { passive: true });

        // initial update
        update();

        return () => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', update);
          if (rafId) cancelAnimationFrame(rafId);
          // restore services and problem
          try {
            gsap.set(services, {
              position: 'relative',
              top: 'auto',
              left: 'auto',
              xPercent: 0,
              yPercent: 0,
              zIndex: 'auto',
              pointerEvents: 'none',
            });
            unpinProblem();
          } catch (e) {}
        };
      },

      // Desktop and wider: keep existing behaviour
      "(min-width: 769px)": () => {
        const tld = gsap.timeline({
          scrollTrigger: {
            trigger: problem,
            start: "bottom bottom",
            end: "+=140%",
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              services.style.pointerEvents = self.progress > 0.98 ? "auto" : "none";
            },
            onComplete: () => {
              gsap.set(services, {
                position: "relative",
                top: "auto",
                left: "auto",
                xPercent: 0,
                yPercent: 0,
                zIndex: "auto",
              });
            },
          },
        });

        tld.to(services, { scale: 1, opacity: 1, ease: "none" });

        return () => {
          try { tld.kill(); } catch (e) {}
          ScrollTrigger.getAll().forEach(st => st.kill());
        };
      }
    });

    ScrollTrigger.refresh();

    return () => {
      try { mm.revert(); } catch (e) {}
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <>
      <section ref={problemRef} style={{ position: "relative", zIndex: 1 }}>
        <Problem />
      </section>

      {/* services tetap satu, tidak diubah posisinya */}
      <section ref={servicesRef} style={{ background: "var(--black)" }}>
        <Services />
      </section>
    </>
  );
}
