import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../css/projects.css';
import { getWhatsAppUrl } from '../utils/whatsapp';

const PROJECTS = [
 
];

// Client-side projects state (fetch from server). We keep the hardcoded list as fallback so design doesn't change
import { useCallback } from 'react';

function useRemoteProjects() {
  const [projects, setProjects] = useState([]);
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) return;
      const json = await res.json();
      // Map to compatibility with existing fields
      const mapped = (json || []).map(p => ({
        id: p.id,
        title: p.title,
        desc: p.description || p.desc || '',
        description: p.description || p.desc || '',
        src: p.src,
        whatsapp: p.whatsapp
      }));
      setProjects(mapped);
    } catch (e) {
      // silent fail; keep fallback
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    const handler = () => fetchProjects();
    window.addEventListener('projects-updated', handler);
    return () => window.removeEventListener('projects-updated', handler);
  }, [fetchProjects]);

  return [projects, fetchProjects];
}

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const videoRefs = useRef({}); // map of refs for cards
  const modalRef = useRef(null);
  const headerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const sectionRef = useRef(null);

  // Projects display controls (show up to PAGE_SIZE by default)
  const PAGE_SIZE = 6;
  const [showAll, setShowAll] = useState(false);
  const [remoteProjects] = useRemoteProjects();
  const projectsList = (remoteProjects && remoteProjects.length > 0) ? remoteProjects : PROJECTS;
  const totalProjects = projectsList.length;
  const displayedProjects = showAll ? projectsList : projectsList.slice(0, PAGE_SIZE);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Desktop: play preview on hover (muted, loop). Mobile: tap opens modal.
  const handlePreviewStart = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;
    // Only autoplay preview on non-touch devices
    if ('ontouchstart' in window) return;
    try {
      video.muted = true;
      video.loop = true;
      video.play().catch(() => { });
    } catch (e) { }
  };

  const handlePreviewStop = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;
    try {
      video.pause();
      video.currentTime = 0;
    } catch (e) { }
  };

  const openModal = (project) => {
    setActive(project);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActive(null);
  };

  // When modal opens, ensure video plays with controls and manage focus/preview
  useEffect(() => {
    if (!open || !active) return;
    const el = modalRef.current;
    if (el) {
      const vid = el.querySelector('video');
      if (vid) {
        vid.controls = true;
        vid.muted = false;
        vid.play().catch(() => { });
      }

      // Focus the close button for accessibility (if available)
      try {
        const btn = closeBtnRef.current;
        btn && btn.focus();
      } catch (e) { }

      // Pause any preview videos on the page so only modal plays
      try {
        Object.values(videoRefs.current || {}).forEach(v => {
          if (v && v !== vid && v.pause) {
            try { v.pause(); v.currentTime = 0; } catch (err) { }
          }
        });
      } catch (e) { }
    }
  }, [open, active]);

  // Lazy load videos when they enter viewport
  useEffect(() => {
    const videoElements = Object.values(videoRefs.current).filter(Boolean);
    if (videoElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && video.dataset.src) {
            // Load video source when it enters viewport
            const source = document.createElement('source');
            source.src = video.dataset.src;
            source.type = 'video/mp4';
            video.appendChild(source);
            video.load();
            // Remove data-src to mark as loaded
            delete video.dataset.src;
            // Stop observing this video
            observer.unobserve(video);
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01
      }
    );

    // Observe all videos
    videoElements.forEach((video) => {
      if (video && video.dataset.src) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // If the Projects grid is internally scrollable, allow scrolling past its end to move to About section
  useEffect(() => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const wheelHandler = (e) => {
      // If modal open, ignore
      if (document.body.classList.contains('project-modal-open')) return;
      const atBottom = Math.abs(grid.scrollHeight - grid.scrollTop - grid.clientHeight) <= 1;
      const atTop = grid.scrollTop <= 0;
      if (e.deltaY > 0 && atBottom) {
        // scroll down past grid => go to About
        e.preventDefault();
        const about = document.getElementById('about');
        if (about) about.scrollIntoView({ behavior: 'smooth' });
      } else if (e.deltaY < 0 && atTop) {
        // scroll up past grid => go to previous section
        e.preventDefault();
        const prev = grid.closest('section').previousElementSibling;
        if (prev) prev.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const touchStart = (e) => {
      touchStartY = e.touches && e.touches[0] ? e.touches[0].clientY : 0;
    };
    const touchMove = (e) => {
      touchEndY = e.touches && e.touches[0] ? e.touches[0].clientY : 0;
    };
    const touchEnd = () => {
      // small threshold to detect swipe
      const dist = touchStartY - touchEndY;
      const atBottom = Math.abs(grid.scrollHeight - grid.scrollTop - grid.clientHeight) <= 1;
      const atTop = grid.scrollTop <= 0;
      if (dist > 40 && atBottom) {
        const about = document.getElementById('about');
        if (about) about.scrollIntoView({ behavior: 'smooth' });
      } else if (dist < -40 && atTop) {
        const prev = grid.closest('section').previousElementSibling;
        if (prev) prev.scrollIntoView({ behavior: 'smooth' });
      }
      touchStartY = touchEndY = 0;
    };

    grid.addEventListener('wheel', wheelHandler, { passive: false });
    grid.addEventListener('touchstart', touchStart, { passive: true });
    grid.addEventListener('touchmove', touchMove, { passive: true });
    grid.addEventListener('touchend', touchEnd, { passive: true });

    return () => {
      try { grid.removeEventListener('wheel', wheelHandler); } catch (e) {}
      try { grid.removeEventListener('touchstart', touchStart); } catch (e) {}
      try { grid.removeEventListener('touchmove', touchMove); } catch (e) {}
      try { grid.removeEventListener('touchend', touchEnd); } catch (e) {}
    };
  }, []);

  // Entrance animation for header: add .is-visible when header enters viewport
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    // Respect prefers-reduced-motion: if reduced, just add class immediately
    const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) {
      headerEl.classList.add('is-visible');
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          headerEl.classList.add('is-visible');
          obs.disconnect();
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    obs.observe(headerEl);
    return () => obs.disconnect();
  }, []);

  // Lock background scroll on ALL devices when modal is open
useEffect(() => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

  if (open) {
    // Hide navbar on mobile only
    if (isMobile) {
      document.body.classList.add('project-modal-open-hide-navbar');
    }

    // Lock scroll on ALL devices (mobile + desktop)
    const scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%'; // prevent layout shift
    document.body.classList.add('project-modal-open-no-scroll');
  } else {
    // Restore everything
    document.body.classList.remove('project-modal-open-hide-navbar');

    if (document.body.classList.contains('project-modal-open-no-scroll')) {
      const top = document.body.style.top || '0px';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('project-modal-open-no-scroll');
      // restore scroll position
      const scrollY = top ? -parseInt(top || '0', 10) : 0;
      window.scrollTo(0, scrollY);
    }
  }

  return () => {
    document.body.classList.remove('project-modal-open-hide-navbar');
    if (document.body.classList.contains('project-modal-open-no-scroll')) {
      const top = document.body.style.top || '0px';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('project-modal-open-no-scroll');
      const scrollY = top ? -parseInt(top || '0', 10) : 0;
      window.scrollTo(0, scrollY);
    }
  };
}, [open]);

  return (
    <section id="projects" className="projects-section py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <header ref={headerRef} className="projects-header text-center mb-6">
          <h2 className="projects-heading">Proyek Kami</h2>
        </header>

        <div id="projects-grid" className="projects-grid">
          {displayedProjects.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              aria-label={`Buka video ${p.title}`}
              className="project-card"
              data-project-id={p.id}
              onMouseEnter={() => handlePreviewStart(p.id)}
              onMouseLeave={() => handlePreviewStop(p.id)}
              onClick={() => openModal(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(p);
                }
              }}
            >
              <div className="project-media">
                <video
                  ref={(el) => (videoRefs.current[p.id] = el)}
                  className="project-video"
                  preload="none"
                  playsInline
                  muted
                  loop
                  aria-hidden="true"
                  data-src={p.src}
                >
                  {/* Source will be added dynamically when video enters viewport */}
                </video>
                <div className="project-overlay" aria-hidden>
                  <div className="project-play">▶</div>
                </div>
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description || p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions: show all / collapse */}
        {totalProjects > PAGE_SIZE && (
          <div className="projects-actions text-center mt-6">
            <button
              className="btn-primary btn-show-all"
              onClick={() => setShowAll(s => !s)}
              aria-expanded={showAll}
              aria-controls="projects-grid"
            >
              {showAll ? `Tampilkan ${PAGE_SIZE}` : `Tampilkan Semua (${totalProjects})`}
            </button>
          </div>
        )}

      </div>

      {/* Modal: render as portal on mobile to escape stacking contexts (ensure it sits above About) */}
      {open && active && (() => {
        // detect mobile viewport (same breakpoint as CSS)
        const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

        const modalContent = (
          <div className="projects-modal opened" role="dialog" aria-modal="true" aria-labelledby={`proj-title-${active.id}`} onClick={closeModal} style={{ zIndex: 2147483647 }}>
            <div className="projects-modal-inner" ref={modalRef} onClick={(e) => e.stopPropagation()} style={{ zIndex: 2147483647 }}>
              <button ref={closeBtnRef} className="projects-modal-close" aria-label="Tutup" onClick={closeModal}>✕</button>

              <div className="projects-modal-grid">
                <div className="projects-modal-media">
                  <video className="projects-modal-video" controls preload="auto" aria-labelledby={`proj-title-${active.id}`}>
                    <source src={active.src} type="video/mp4" />
                  </video>
                </div>

                <div className="projects-modal-content">
                  <h3 id={`proj-title-${active.id}`} className="projects-modal-title">{active.title}</h3>
                  <p className="projects-modal-desc">{active.description || active.desc}</p>
                  <div className="projects-modal-actions">
                    <button
                      className="btn-primary btn-modal-consult"
                      onClick={() => {
                        const waParam = active && active.whatsapp;
                        const url = waParam
                          ? (waParam.startsWith('http') ? waParam : getWhatsAppUrl(waParam))
                          : getWhatsAppUrl('general');
                        const w = window.open(url, '_blank');
                        if (w) w.opener = null;
                      }}
                      aria-label="Konsultasi"
                    >
                      Tertarik
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );

        // Render modal via portal into document.body for all viewports so it escapes any stacking/overflow contexts
        return createPortal(modalContent, document.body);
      })()}
    </section>
  );
}
