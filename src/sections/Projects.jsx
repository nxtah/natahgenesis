import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../css/projects.css';
import { getWhatsAppUrl } from '../utils/whatsapp';

const PROJECTS = [
  {
    id: 'p1',
    title: 'Website E-Commerce Minuman dengan Pemesanan Cepat',
    desc: 'Website penjualan minuman segar dengan tampilan visual produk yang kuat, informasi harga dan durasi pengiriman, pilihan varian, serta CTA pemesanan instan. Dirancang untuk mempercepat keputusan beli dengan layout bersih dan fokus ke produk.',
    src: 'https://res.cloudinary.com/dimw2tqof/video/upload/v1767679542/web_1_b5u6fr.mp4',
    /* Optional: set whatsapp key or full url for this project (e.g. 'portfolio' or 'business' or full 'https://wa.me/...') */
    whatsapp: 'portfolio'
  },
  {
    id: 'p2',
    title: 'Landing Page Kuliner dengan Fokus Konversi',
    desc: 'Landing page untuk bisnis kuliner street food dengan visual kontras tinggi, headline kuat, informasi menu dan saus, serta tombol order langsung. Dirancang untuk menarik perhatian dan mendorong pembelian cepat.',
    src: 'https://res.cloudinary.com/dimw2tqof/video/upload/v1767679539/web_5_uup2mx.mp4',
    whatsapp: 'general'
  },
  {
    id: 'p3',
    title: 'Website Brand Lifestyle dengan Storytelling Visual',
    desc: 'Website brand dengan pendekatan storytelling yang kuat, menggabungkan visual elegan, copy premium, dan alur eksplorasi yang halus untuk membangun kesan eksklusif serta memperkuat identitas brand.',
    src: 'https://res.cloudinary.com/dimw2tqof/video/upload/v1767679538/web_3_isfevy.mp4'
  },
  {
    id: 'p4',
    title: 'Website Creative Agency Berbasis Portofolio',
    desc: 'Website agency kreatif yang berfokus pada showcase karya, statistik pencapaian, dan call-to-action proyek. Menggunakan layout dinamis dan hierarki konten yang jelas untuk menarik klien potensial.',
    src: 'https://res.cloudinary.com/dimw2tqof/video/upload/v1767679536/web_4_qdpsyt.mp4'
  },
  {
    id: 'p5',
    title: 'Website Company Profile Digital Agency',
    desc: 'Website company profile untuk digital agency yang menonjolkan value, layanan, dan pendekatan kreatif melalui desain minimalis, typography modern, dan navigasi yang jelas untuk meningkatkan kredibilitas dan konversi klien.',
    src: 'https://res.cloudinary.com/dimw2tqof/video/upload/v1767679533/web_2_ierz3k.mp4'
  }
];

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const videoRefs = useRef({}); // map of refs for cards
  const modalRef = useRef(null);
  const headerRef = useRef(null);
  const closeBtnRef = useRef(null);

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

  // Hide navbar and lock background scroll on mobile while project modal is open
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

    if (open && isMobile) {
      // Hide navbar (existing behavior)
      document.body.classList.add('project-modal-open-hide-navbar');

      // Lock background scroll on mobile: save scroll position and fix body
      const scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('project-modal-open-no-scroll');
    } else {
      // Restore
      document.body.classList.remove('project-modal-open-hide-navbar');

      if (document.body.classList.contains('project-modal-open-no-scroll')) {
        const top = document.body.style.top || '0px';
        document.body.style.position = '';
        document.body.style.top = '';
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

        <div className="projects-grid">
          {PROJECTS.map((p) => (
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
                <p className="project-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: render as portal on mobile to escape stacking contexts (ensure it sits above About) */}
      {open && active && (() => {
        // detect mobile viewport (same breakpoint as CSS)
        const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

        const modalContent = (
          <div className="projects-modal opened" role="dialog" aria-modal="true" aria-labelledby={`proj-title-${active.id}`} onClick={closeModal}>
            <div className="projects-modal-inner" ref={modalRef} onClick={(e) => e.stopPropagation()}>
              <button ref={closeBtnRef} className="projects-modal-close" aria-label="Tutup" onClick={closeModal}>✕</button>

              <div className="projects-modal-grid">
                <div className="projects-modal-media">
                  <video className="projects-modal-video" controls preload="auto" aria-labelledby={`proj-title-${active.id}`}>
                    <source src={active.src} type="video/mp4" />
                  </video>
                </div>

                <div className="projects-modal-content">
                  <h3 id={`proj-title-${active.id}`} className="projects-modal-title">{active.title}</h3>
                  <p className="projects-modal-desc">{active.desc}</p>
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

        if (!isMobile) return modalContent;

        // Render portal into document.body on mobile
        return createPortal(modalContent, document.body);
      })()}
    </section>
  );
}
