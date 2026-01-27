
import '../css/components/navbar.css';
import { getWhatsAppUrl } from '../utils/whatsapp';
import ChatbotIcon from './ChatbotIcon';
import { useEffect, useState, useRef } from 'react';

// Hook untuk mendeteksi section terang/gelap dan active section (data-section)
function useNavbarState() {
  const [fontColor, setFontColor] = useState('navbar-light');
  const [activeSection, setActiveSection] = useState('hero');
  const [heroScrolled, setHeroScrolled] = useState(false);

  useEffect(() => {
    // Deteksi tema section
    const sections = document.querySelectorAll('section[data-theme]');
    
    const themeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Ubah jadi 0.2 biar lebih cepet trigger
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            const theme = entry.target.getAttribute('data-theme');
            setFontColor(theme === 'light' ? 'navbar-dark' : 'navbar-light');
          }
        });
      },
      { threshold: [0, 0.2, 0.3, 0.5, 0.7, 1] } // tambahin lebih banyak threshold
    );

    sections.forEach((section) => themeObserver.observe(section));

    // Detect active section (the one most visible) by observing main sections + footer
    const sectionsWithId = document.querySelectorAll('section[id], footer[id]');
    let activeObserver = null;
    if (sectionsWithId && 'IntersectionObserver' in window) {
      activeObserver = new IntersectionObserver((entries) => {
        // pick the entry with the largest intersectionRatio that is intersecting
        const visible = entries.filter(e => e.isIntersecting && e.intersectionRatio > 0);
        if (visible.length) {
          const best = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
          if (best && best.target && best.target.id) setActiveSection(best.target.id);
        }
      }, { threshold: [0.25, 0.45, 0.6, 0.8] });

      sectionsWithId.forEach(s => activeObserver.observe(s));
      // set initial active section based on scroll position
      const init = Array.from(sectionsWithId).find(s => {
        const r = s.getBoundingClientRect();
        return r.top <= window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.2;
      });
      if (init) {
        // Defer state update to avoid cascading synchronous renders
        setTimeout(() => setActiveSection(init.id), 0);
      }
    }

    // Hero scroll detection
    let sentinelObserver = null;
    const handleScroll = () => {
      const hero = document.querySelector('section#hero');
      if (hero) {
        const r = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -r.top / r.height));
        setHeroScrolled(progress > 0.05);
      } else {
        setHeroScrolled(false);
      }
    };

    const sentinel = document.querySelector('#hero-sentinel');
    if (sentinel && 'IntersectionObserver' in window) {
      sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          setHeroScrolled(!entry.isIntersecting);
        });
      }, { threshold: [0, 1] });
      sentinelObserver.observe(sentinel);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      themeObserver.disconnect();
      if (activeObserver) activeObserver.disconnect();
    };
  }, []);

  return { fontColor, activeSection, heroScrolled };
}


const Navbar = () => {
  // Map section ids to readable labels (localized)
  const SECTION_LABELS = {
    hero: 'Home',
    problem: 'Masalahmu?',
    'why-us': 'Kenapa?',
    process: 'Langkah',
    pricing: 'Harga',
    testimonials: 'Testimoni',
    projects: 'Projek',
    about: 'Tentang',
    contact: 'Sikat',
    footer: 'Makasih:)',
    services: 'Solusi'
  };
  const { fontColor, activeSection, heroScrolled } = useNavbarState();
  const sectionName = SECTION_LABELS[activeSection] || 'Home';
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Overlay visibility and close-animation control
  const [showOverlay, setShowOverlay] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef(null);
  const EXIT_ANIM_MS = 520; // should match CSS close animation durations
  const [originalOverflow, setOriginalOverflow] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function handleRequestClose() {
    // Start closing animation and hide overlay after timeout
    if (isClosing) return; // already closing
    setIsClosing(true);
    // Set menuOpen false for semantics (aria-expanded etc.) but keep overlay visible
    setMenuOpen(false);

    // Immediately restore body scroll to avoid blocking scroll after close
    if (originalOverflow !== null) {
      document.body.style.overflow = originalOverflow || '';
      setOriginalOverflow(null);
    } else {
      document.body.style.overflow = '';
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      setShowOverlay(false);
      closeTimeoutRef.current = null;
    }, EXIT_ANIM_MS);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') handleRequestClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    // When menu opens, reset closing state and clear pending close timers
    if (menuOpen) {
      setIsClosing(false);
      if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    }
    return () => {
      // cleanup timers on unmount
      if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    };
  }, [menuOpen]);

  // Lock body scroll while overlay is visible and always ensure it's reset correctly
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const overlayVisible = menuOpen || isClosing;

    if (overlayVisible) {
      // Store original once, then lock
      if (originalOverflow === null) {
        setOriginalOverflow(document.body.style.overflow);
      }
      document.body.style.overflow = 'hidden';
    } else {
      // Only restore original stored value
      if (originalOverflow !== null) {
        document.body.style.overflow = originalOverflow || '';
        setOriginalOverflow(null);
      } else {
        // Fallback: ensure it's not stuck
        document.body.style.overflow = '';
      }
    }
    return () => {
      // Cleanup: always restore original if present
      if (originalOverflow !== null) {
        document.body.style.overflow = originalOverflow || '';
        setOriginalOverflow(null);
      }
    };
  }, [menuOpen, isClosing, originalOverflow]);

  function handleToggleMenu() {
    if (!menuOpen) {
      setMenuOpen(true);
    } else {
      handleRequestClose();
    }
  }

  return (
    <>
      <nav className={`navbar font-body ${fontColor} ${isMobile && heroScrolled ? 'navbar--compact' : ''}`}>
        {/* Top group: logo + hamburger (mobile centered group) */}
        <div className="navbar-top">
          <div className="navbar-section navbar-logo-bg">
            <span className="navbar-logo">natah-genesis</span>
          </div>

          {/* Hamburger BG block (sibling) — mobile only behavior controlled by CSS */}
          <div className="navbar-section navbar-hamburger-bg" aria-hidden={!isMobile}>
            <button
              className={`navbar-hamburger ${menuOpen ? 'is-open' : ''}`}
              onClick={handleToggleMenu}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
            >
              {/* Inline 'apps' SVG icon (represents menu) - mobile only styling in CSS */}
              <svg className="navbar-hamburger-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Default row (center + chatbot). Hidden with CSS when compact on mobile */}
        <div className="navbar-mobile-row">
          <div className="navbar-center">
            <span className={`navbar-section-title ${sectionName ? 'active' : ''}`} aria-current={sectionName ? 'true' : 'false'}>{sectionName}</span>
            <a
              href={getWhatsAppUrl()}
              className="navbar-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi gratis!
            </a>
          </div>
          <div
            className="navbar-section navbar-chatbot"
            title="Chatbot"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onClick={() => window.dispatchEvent(new Event('open-botpress'))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.dispatchEvent(new Event('open-botpress')); } }}
          >
            <ChatbotIcon />
          </div>
        </div>
      </nav>

      {/* Fullscreen mobile menu overlay */}
      {(menuOpen || isClosing) && (
        <div className={`mobile-fullmenu ${isClosing ? 'mobile-fullmenu--closing' : 'mobile-fullmenu--open'}`} role="dialog" aria-modal="true">
          <button className="mobile-fullmenu-close" onClick={handleRequestClose} aria-label="Tutup menu">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6L18 18M6 18L18 6" />
            </svg>
          </button>
          <div className="mobile-fullmenu-content">
            <a href="#hero" onClick={handleRequestClose}>Beranda</a>
            <a href="#services" onClick={handleRequestClose}>Solusi</a>
            <a href="#projects" onClick={handleRequestClose}>Projek</a>
          </div>

          {/* Footer action buttons: left = Konsultasi, right = Chatbot (same size) */}
          <div className="mobile-fullmenu-footer" role="group" aria-label="Aksi cepat">
            <a href={getWhatsAppUrl()} className="mobile-fullmenu-cta" onClick={() => { handleRequestClose(); }} aria-label="Konsultasi gratis">
              {/* WhatsApp icon */}
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.8 16.45c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.55-.18-.78.18-.22.35-.86 1.14-1.05 1.37-.19.22-.38.25-.73.08-.35-.18-1.47-.54-2.79-1.72-1.03-.9-1.72-2.02-1.92-2.37-.19-.35-.02-.54.15-.72.15-.15.35-.38.52-.57.17-.19.23-.35.35-.57.12-.22.04-.42-.02-.6-.06-.18-.78-1.88-1.07-2.58-.28-.67-.57-.58-.78-.59-.2-.02-.43-.02-.66-.02-.22 0-.57.08-.87.35-.3.27-1.14 1.11-1.14 2.71 0 1.59 1.17 3.12 1.33 3.34.15.22 2.28 3.5 5.52 4.77 3.24 1.27 3.24.85 3.82.8.57-.05 1.86-.76 2.12-1.49.26-.73.26-1.35.19-1.49-.07-.15-.32-.22-.67-.4z" fill="#25D366"/>
              </svg>
              <span className="mobile-fullmenu-label">Konsultasi<br />gratis!</span>
              <span className="sr-only">Konsultasi gratis</span>
            </a>
            <button className="mobile-fullmenu-chatbot" onClick={() => { const el = document.querySelector('.navbar-chatbot'); el && el.click && el.click(); handleRequestClose(); }} aria-label="Buka Chatbot">
              <ChatbotIcon />
              <span className="mobile-fullmenu-label mobile-fullmenu-label--right">Demo<br/>Chatbot AI</span>
              <span className="sr-only">Buka Chatbot</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
