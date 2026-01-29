import { useEffect, useRef, useState } from "react";
import useScrollReveal from "../utils/useScrollReveal";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "../css/about.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [ref, isVisible] = useScrollReveal(0.18);
  const sectionRef = useRef(null);
  const sloganRef = useRef(null);

  // Random decorative emoji (changes every 0.5s). Disabled when prefers-reduced-motion is set.
  const [emoji, setEmoji] = useState('\u2728');
  const emojiIntervalRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
      },
      (context) => {
        if (!context.conditions.isDesktop) return;

        const lines = sloganRef.current.querySelectorAll('.slogan-line');
        gsap.set(lines, { y: 20, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        tl.to(lines, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        });

        // Background transition: animate section bg from black -> white as user scrolls into about
        // Also toggle .about--white when more than half visible for text contrast
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Initialize background respecting reduced motion preference
        gsap.set(sectionRef.current, { backgroundColor: prefersReduced ? 'var(--white)' : 'var(--black)' });

        // lockedRef prevents the background from reverting once Section5 is reached
        const lockedRef = { current: false };

        let bgTween;
        if (!prefersReduced) {
          // Use a proper scroll range so the transition scrubs smoothly while scrolling into the section
          bgTween = gsap.to(sectionRef.current, {
            backgroundColor: 'var(--white)',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1.2,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // If locked by Section5, always keep white
                if (lockedRef.current) {
                  sectionRef.current.classList.add('about--white');
                  return;
                }

                if (self.progress > 0.5) sectionRef.current.classList.add('about--white');
                else sectionRef.current.classList.remove('about--white');
              }
            }
          });
        } else {
          // Respect reduced motion: immediately set to white state for better contrast
          sectionRef.current.classList.add('about--white');
        }

        // Watch for Section5 entering viewport and lock the about background to white when it does
        const section5El = document.getElementById('why-us') || sectionRef.current && sectionRef.current.nextElementSibling;
        let section5Io;
        try {
          if (section5El && 'IntersectionObserver' in window) {
            section5Io = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  lockedRef.current = true;
                  sectionRef.current && sectionRef.current.classList.add('about--white');
                  gsap.set(sectionRef.current, { backgroundColor: 'var(--white)' });
                }
              });
            }, { threshold: 0.01 });
            section5Io.observe(section5El);
          }
        } catch (e) { /* ignore */ }

        // Subtle parallax entrance/exit for the two-column block (desktop) — smooth and not too fast
        let parallaxLeft, parallaxRight, parallaxBottom;
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const leftEl = sectionRef.current.querySelector('.about-bottom .col-left');
          const rightEl = sectionRef.current.querySelector('.about-bottom .col-right');

          if (leftEl) {
            // Use larger yPercent for a faster feel and longer scrub for super-smooth movement
            gsap.set(leftEl, { willChange: 'transform' });
            parallaxLeft = gsap.to(leftEl, {
              yPercent: -20,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: leftEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2.2,
                invalidateOnRefresh: true,
              }
            });
          }

          if (rightEl) {
            gsap.set(rightEl, { willChange: 'transform' });
            parallaxRight = gsap.to(rightEl, {
              yPercent: -12,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: rightEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2.2,
                invalidateOnRefresh: true,
              }
            });
          }

          // Add a dedicated parallax for the whole bottom block for a stronger layered effect
          const bottomBlock = sectionRef.current.querySelector('.about-bottom');
          if (bottomBlock) {
            parallaxBottom = gsap.to(bottomBlock, {
              yPercent: -10,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: bottomBlock,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2.2,
                invalidateOnRefresh: true,
              }
            });
          }
        }

        // Desktop-only pointer-follow
        let pointerCleanup;
        let entranceTl;
        let hashHandler;
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && sectionRef.current) {
          const el = sectionRef.current;
          const linesArray = Array.from(lines);

          const quicks = linesArray.map((line) =>
            gsap.quickTo(line, 'x', {
              duration: 1.4,
              ease: 'power2.out'
            })
          );

          function handleMove(e) {
            const sectionRect = el.getBoundingClientRect();
            const mouseX = e.clientX - sectionRect.left; // Posisi mouse dalam section
            const sectionWidth = sectionRect.width;
            const t = Math.max(0, Math.min(1, mouseX / sectionWidth)); // 0 = kiri, 1 = kanan

            const viewportWidth = window.innerWidth;

            linesArray.forEach((line, i) => {
              const lineRect = line.getBoundingClientRect();
              const lineWidth = lineRect.width;

              // Hitung jarak yang bisa ditempuh ke kiri dan kanan dari posisi center
              const spaceLeft = lineRect.left + (lineWidth / 2); // Jarak dari tengah text ke tepi kiri viewport
              const spaceRight = viewportWidth - (lineRect.left + lineWidth / 2); // Jarak dari tengah text ke tepi kanan viewport

              // Mapping t (0 to 1) ke movement
              // t = 0 -> gerak ke kiri maksimal (-spaceLeft + lineWidth/2)
              // t = 0.5 -> stay center (0)
              // t = 1 -> gerak ke kanan maksimal (spaceRight - lineWidth/2)

              const maxLeft = spaceLeft - (lineWidth / 2);
              const maxRight = spaceRight - (lineWidth / 2);

              const value = (t - 0.5) * 2 * (t < 0.5 ? maxLeft : maxRight);

              quicks[i](value);
            });
          }

          el.addEventListener('mousemove', handleMove, { passive: true });

          pointerCleanup = () => {
            if (!el) return;
            el.removeEventListener('mousemove', handleMove);
          };
        }

        // Run entrance animation when user navigates directly to #about (hash change) or land on the page with #about
        function runDirectEntrance() {
          if (!sectionRef.current || sectionRef.current.classList.contains('about--entered')) return;

          const lines = sloganRef.current.querySelectorAll('.slogan-line');
          const bottomEl = sectionRef.current.querySelector('.about-bottom');

          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(lines, { y: 0, opacity: 1 });
            if (bottomEl) gsap.set(bottomEl, { y: 0, opacity: 1 });
            // Also ensure paragraphs visible
            const paras = sectionRef.current.querySelectorAll('.about-bottom .col-right p:not(.mobile-only-combined)');
            paras.forEach(p => {
              p.querySelectorAll('.line').forEach(l => gsap.set(l, { y: 0, opacity: 1 }));
              // make sure lines are inline-block so paragraphs stay justify-friendly
              p.querySelectorAll('.line').forEach(l => { l.style.display = 'inline-block'; });
              gsap.set(p, { y: 0, opacity: 1 });
            });
            sectionRef.current.classList.add('about--entered');
            return;
          }

          // Ensure paragraph lines are prepared (in case splitIntoLines hasn't run yet)
          const paras = sectionRef.current.querySelectorAll('.about-bottom .col-right p:not(.mobile-only-combined)');
          paras.forEach(p => {
            if (!p.dataset.original) p.dataset.original = p.innerText.trim();
            if (!p.querySelectorAll('.line').length) {
              // quick split: naive by words to create lines for per-line animation
              const text = p.dataset.original;
              const words = text.split(/\s+/);
              p.innerHTML = '';
              let currentLine = document.createElement('span');
              currentLine.className = 'line';
              currentLine.style.display = 'inline-block';
              currentLine.style.whiteSpace = 'normal';
              p.appendChild(currentLine);
              let prevHeight = currentLine.getBoundingClientRect().height;
              words.forEach((w, idx) => {
                const node = document.createTextNode((idx ? ' ' : '') + w);
                currentLine.appendChild(node);
                const newH = currentLine.getBoundingClientRect().height;
                if (newH > prevHeight + 0.5) {
                  currentLine.removeChild(node);
                  currentLine = document.createElement('span');
                  currentLine.className = 'line';
                  currentLine.style.display = 'inline-block';
                  currentLine.style.whiteSpace = 'normal';
                  p.appendChild(currentLine);
                  currentLine.appendChild(document.createTextNode(w));
                  prevHeight = currentLine.getBoundingClientRect().height;
                } else {
                  prevHeight = newH;
                }
              });
              p.querySelectorAll('.line').forEach(node => {
                node.style.display = 'block';
                node.style.overflow = 'visible';
                node.style.willChange = 'transform, opacity';
              });
            }
          });

          entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          entranceTl.fromTo(lines, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12 });

          // Animate each paragraph's lines per-line
          paras.forEach((p) => {
            const lines = p.querySelectorAll('.line');
            if (lines.length) {
              entranceTl.fromTo(lines, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, '-=0.9');
            } else {
              entranceTl.fromTo(p, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.9');
            }
          });

          if (bottomEl) entranceTl.fromTo(bottomEl, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, '-=0.8');
          entranceTl.call(() => sectionRef.current && sectionRef.current.classList.add('about--entered'));
        }

        // Attach hashchange listener and trigger immediately if already at #about
        hashHandler = () => {
          if (window.location.hash === '#about') runDirectEntrance();
        };
        window.addEventListener('hashchange', hashHandler);
        // If user landed directly on the section (page load with hash) or browser scrolled to it already
        if (window.location.hash === '#about') runDirectEntrance();
        else {
          const rect = sectionRef.current.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) runDirectEntrance();
        }

        // Fallback: use IntersectionObserver to reliably trigger the entrance when section becomes visible
        let io;
        if ('IntersectionObserver' in window) {
          io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                runDirectEntrance();
                if (io) {
                  io.disconnect();
                }
              }
            });
          }, { threshold: 0.35 });
          io.observe(sectionRef.current);
        }

        // Emoji updater: change decorative emoji every 0.5s unless user prefers reduced motion
        if (typeof window !== 'undefined') {
          const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const EMOJIS = ['✨', '🌱', '🚀', '🎯', '💡', '🤝', '🔧', '🔥', '🌟', '📈', '🧩', '💬', '🛰️', '🎨', '🛠️'];
          // initial random
          if (!prefersReduced) {
            setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
            if (emojiIntervalRef.current) { clearInterval(emojiIntervalRef.current); }
            emojiIntervalRef.current = setInterval(() => {
              const next = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
              setEmoji(next);
            }, 500);
          } else {
            // single static emoji when reduced motion preferred
            if (emojiIntervalRef.current) { clearInterval(emojiIntervalRef.current); emojiIntervalRef.current = null; }
            setEmoji('✨');
          }
        }



        return () => {
          tl.kill();
          if (parallaxLeft) { parallaxLeft.scrollTrigger && parallaxLeft.scrollTrigger.kill(); parallaxLeft.kill(); }
          if (parallaxRight) { parallaxRight.scrollTrigger && parallaxRight.scrollTrigger.kill(); parallaxRight.kill(); }
          if (parallaxBottom) { parallaxBottom.scrollTrigger && parallaxBottom.scrollTrigger.kill(); parallaxBottom.kill(); }
          if (bgTween) { bgTween.scrollTrigger && bgTween.scrollTrigger.kill(); bgTween.kill(); }
          if (pointerCleanup) pointerCleanup();
          if (entranceTl) { entranceTl.kill(); }
          if (hashHandler) window.removeEventListener('hashchange', hashHandler);
          // clear emoji interval if set
          if (emojiIntervalRef.current) { clearInterval(emojiIntervalRef.current); emojiIntervalRef.current = null; }
        };
      }
    );

    // Mobile-only (outside desktop block): set background to white immediately (no transition). Does not affect desktop
    mm.add({ isMobile: '(max-width: 1023px)' }, (mCtx) => {
      if (!mCtx.conditions.isMobile) return;
      // Ensure immediate white background on mobile
      gsap.set(sectionRef.current, { backgroundColor: 'var(--white)' });
      sectionRef.current.classList.add('about--white');
      // Do not remove .about--white on cleanup (keep always white)
      return () => {};
    });

    // Failsafe: also observe About section directly and toggle white state when more than half visible
    // This helps in cases where the Projects grid intercepts scroll and prevents GSAP's ScrollTrigger
    try {
      if ('IntersectionObserver' in window && sectionRef.current) {
        // Always keep .about--white and background white, no toggling back to black
        sectionRef.current.classList.add('about--white');
        gsap.set(sectionRef.current, { backgroundColor: 'var(--white)' });
        // No observer needed, no cleanup needed
        return () => {};
      }
    } catch (e) { /* fail silently */ }

    // Also add repeated entrance animations for the left image and per-line slide-up for right column paragraphs
    mm.add('(min-width: 0px)', (context) => {
      if (!sectionRef.current) return;

      // Respect reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Ensure content visible
        const paras = sectionRef.current.querySelectorAll('.about-bottom .col-right p:not(.mobile-only-combined)');
        paras.forEach(p => {
          if (!p.dataset.original) p.dataset.original = p.innerText.trim();
          p.querySelectorAll('.line').forEach(l => gsap.set(l, { y: 0, opacity: 1 }));
        });
        const leftImg = sectionRef.current.querySelector('.about-bottom .col-left img');
        if (leftImg) gsap.set(leftImg, { y: 0, opacity: 1 });
        return;
      }

      const createdTimelines = [];
      const createdScrollTriggers = [];

      function splitIntoLines(el) {
        if (!el) return;
        if (!el.dataset.original) el.dataset.original = el.innerText.trim();
        const text = el.dataset.original;
        const words = text.split(/\s+/);
        el.innerHTML = '';

        let currentLine = document.createElement('span');
        currentLine.className = 'line';
        currentLine.style.display = 'inline-block';
        currentLine.style.whiteSpace = 'normal';
        el.appendChild(currentLine);

        let prevHeight = currentLine.getBoundingClientRect().height;

        words.forEach((w, idx) => {
          const node = document.createTextNode((idx ? ' ' : '') + w);
          currentLine.appendChild(node);
          const newH = currentLine.getBoundingClientRect().height;
          // if height increased, word wrapped to new line
          if (newH > prevHeight + 0.5) {
            currentLine.removeChild(node);
            // start a new line
            currentLine = document.createElement('span');
            currentLine.className = 'line';
            currentLine.style.display = 'inline-block';
            currentLine.style.whiteSpace = 'normal';
            el.appendChild(currentLine);
            currentLine.appendChild(document.createTextNode(w));
            prevHeight = currentLine.getBoundingClientRect().height;
          } else {
            prevHeight = newH;
          }
        });

        // Leave lines as inline-block so text justification still works
        el.querySelectorAll('.line').forEach(node => {
          node.style.display = 'inline-block';
          node.style.overflow = 'visible';
          node.style.willChange = 'transform, opacity';
        });
      }

      function buildParagraphAnimations() {
        // Kill previous triggers/timelines (if any)
        createdScrollTriggers.forEach(t => t && t.kill && t.kill());
        createdTimelines.forEach(t => t && t.kill && t.kill());
        createdScrollTriggers.length = 0;
        createdTimelines.length = 0;

        const paras = sectionRef.current.querySelectorAll('.about-bottom .col-right p:not(.mobile-only-combined)');
        paras.forEach((p) => {
          // split into lines based on current width
          splitIntoLines(p);
          const lines = p.querySelectorAll('.line');
          gsap.set(lines, { y: 22, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: p,
              start: 'top 85%',
              toggleActions: 'play none none reverse', // play on enter, reverse on leave-back
              markers: false,
            }
          });

          tl.to(lines, { y: 0, opacity: 1, duration: 0.75, stagger: 0.06, ease: 'power3.out' });

          createdTimelines.push(tl);
          if (tl.scrollTrigger) createdScrollTriggers.push(tl.scrollTrigger);
        });
      }

      // Left image animation: animate each time it enters view
      const leftImg = sectionRef.current.querySelector('.about-bottom .col-left img');
      if (leftImg) {
        // kill any previous trigger attached to the img
        const tlImg = gsap.timeline({
          scrollTrigger: {
            trigger: leftImg,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
            scrub: 0.8,
          }
        });
        // Use transform-only animation and force3D for smoother motion
        gsap.set(leftImg, { yPercent: 6, opacity: 0.98, force3D: true });
        tlImg.to(leftImg, { yPercent: 0, opacity: 1, duration: 1.05, ease: 'power2.out', force3D: true });
        createdTimelines.push(tlImg);
        if (tlImg.scrollTrigger) createdScrollTriggers.push(tlImg.scrollTrigger);
      }

      buildParagraphAnimations();

      // Rebuild on resize so line wrapping updates
      let resizeTimeout;
      function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const paras = sectionRef.current.querySelectorAll('.about-bottom .col-right p:not(.mobile-only-combined)');
          paras.forEach(p => { p.innerText = p.dataset.original || p.innerText; });
          buildParagraphAnimations();
        }, 150);
      }
      window.addEventListener('resize', onResize, { passive: true });

      return () => {
        createdScrollTriggers.forEach(t => t && t.kill && t.kill());
        createdTimelines.forEach(t => t && t.kill && t.kill());
        window.removeEventListener('resize', onResize);
      };
    });

    return () => mm.revert();
  }, []);



  return (
    <section
      id="about"
      ref={sectionRef}
      className="about font-body min-h-screen flex flex-col relative overflow-hidden"
      aria-labelledby="about-title about-title-mobile"
      data-theme="light"
    >
      <div ref={ref} className="container mx-auto px-6 md:px-12 flex-1 flex items-center justify-center">
        <div ref={sloganRef} className={`slogan text-center flex flex-col justify-center items-center gap-6 py-12 ${isVisible ? "reveal" : ""}`}>
          {/* Desktop: two separate lines (kept for desktop GSAP animation) */}
          <h2
            id="about-title"
            className="slogan-line hidden lg:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
          >
            Membantu bisnis tumbuh —
          </h2>
          <h2 className="slogan-line hidden lg:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            desain & teknologi<span className="ml-2 emoji" aria-hidden="true" style={{ display: 'inline-block' }}>{emoji}</span>
          </h2>

          {/* Mobile-only combined heading (kept identical text) */}
          <h2 id="about-title-mobile" className="slogan-line-mobile lg:hidden text-3xl sm:text-4xl md:text-5xl leading-tight">
            Membantu bisnis tumbuh — desain & teknologi<span className="ml-2 emoji" aria-hidden="true" style={{ display: 'inline-block' }}>{emoji}</span>
          </h2>
        </div>
      </div>

      {/* Two-column block under About */}
      <div className="about-bottom container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-8 md:gap-12 items-stretch">
          <div className="col-left overflow-hidden h-full">
            <img src="/images/about/profile.png" alt="Ilustrasi layanan Natah Genesis" loading="lazy" className="w-full h-full object-cover block" />
          </div>

          <div className="col-right text-montreal flex flex-col text-left w-full">
            {/* Mobile-only: combined paragraph for easier reading on small screens */}
            <p className="mobile-only-combined mb-4 text-left w-full md:hidden">Natah-Genesis adalah layanan agensi pembuatan website dan integrasi AI chatbot yang membantu bisnis kecil, pelajar, dan individu memiliki website profesional dengan proses yang sederhana dan efisien.<br /><br />Kami menyediakan solusi website yang cepat digunakan, fungsional, dan terjangkau, termasuk AI chatbot untuk membantu interaksi dengan pengunjung dan mengarahkan mereka ke komunikasi lanjutan melalui WhatsApp.<br /><br />Dengan pendekatan yang fokus pada kebutuhan klien, Natah-Genesis memastikan setiap website dibangun untuk mendukung kepercayaan dan aktivitas bisnis, bukan sekadar tampilan.</p>

            <p className="mb-4 text-left w-full">Natah-Genesis adalah layanan agensi pembuatan website dan integrasi AI chatbot yang membantu bisnis kecil, pelajar, dan individu memiliki website profesional dengan proses yang sederhana dan efisien.</p>

            <p className="mb-4 text-left w-full">Kami menyediakan solusi website yang cepat digunakan, fungsional, dan terjangkau, termasuk AI chatbot untuk membantu interaksi dengan pengunjung dan mengarahkan mereka ke komunikasi lanjutan melalui WhatsApp.</p>

            <p className="mb-0 text-left w-full">Dengan pendekatan yang fokus pada kebutuhan klien, Natah-Genesis memastikan setiap website dibangun untuk mendukung kepercayaan dan aktivitas bisnis, bukan sekadar tampilan.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default About;