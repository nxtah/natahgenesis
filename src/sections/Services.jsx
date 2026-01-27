import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/services.css';
import { getWhatsAppUrl } from '../utils/whatsapp';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const [showServices, setShowServices] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 640 : false);
    const shownRef = useRef(false);
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const yangRef = useRef(null);
    const kamiRef = useRef(null);
    const listRef = useRef(null);
    const leftCtaRef = useRef(null);
    const [ctaStyle, setCtaStyle] = useState({});

    // Data services/solusi
    const services = [
        {
            head: 'Website Penjualan Konversi',
            sub: 'Website cepat, aman, dan dirancang untuk meningkatkan konversi & pengalaman pembeli.'
        },
        {
            head: 'Chatbot Pintar & Automasi',
            sub: 'Automasi percakapan multichannel dengan integrasi CRM untuk respons cepat dan follow-up otomatis.'
        },
        {
            head: 'SEO Teknis & Konten',
            sub: 'Optimasi teknis dan konten yang menaikkan peringkat dan mendatangkan traffic berkualitas.'
        },
    ];

    useEffect(() => {
        let headingWidth = 0;
        const section = sectionRef.current;
        const heading = headingRef.current;
        const yang = yangRef.current;
        const kami = kamiRef.current;
        if (!section || !heading || !yang || !kami) return;
        // Ambil lebar heading setelah render
        headingWidth = heading.offsetWidth;

        // 1. Background color transition
        // Disable background animation on mobile (keep static white background)
        const _bgMobile = window.innerWidth <= 640;
        if (!_bgMobile) {
            // Desktop/tablet: animate background and toggle dark class
            gsap.set(section, { backgroundColor: 'var(--white)' });
            gsap.to(section, {
                backgroundColor: 'var(--black)',
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 20%',
                    end: 'top 90%',
                    scrub: 0.5,
                    onUpdate: (self) => {
                        // add/remove dark class based on progress to ensure text color is white
                        if (self.progress > 0.1) {
                            section.classList.add('services--dark');
                        } else {
                            section.classList.remove('services--dark');
                        }
                    }
                },
            });
        } else {
            // Mobile: enforce static black background and ensure text is white
            section.style.backgroundColor = 'var(--black)';
            // apply dark styles (white text) on mobile
            section.classList.add('services--dark');
        }

        // 2. Heading moves left & new text fades in (after bg transition)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    // Slightly more forgiving on mobile devices
                    start: window.innerWidth <= 240 ? 'top 30%' : 'top 15%',
                    end: 'top -40%',
                    scrub: 3,
                    onUpdate: (self) => {
                        // Tampilkan list services jika animasi heading sudah cukup ke kiri (progress > 0.1)
                        if (self.progress > 0.1 && !shownRef.current) {
                            setShowServices(true);
                            shownRef.current = true;
                        } else if (self.progress <= 0.3 && shownRef.current) {
                            setShowServices(false);
                            shownRef.current = false;
                        }
                    }
                }
            });

            // On small screens, trigger animations when section enters viewport using IntersectionObserver
            let mobileObserver = null;
            if (window.innerWidth <= 640) {
                // More forgiving observer for mobile: trigger when section is roughly in view
                mobileObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !shownRef.current) {
                            setShowServices(true);
                            shownRef.current = true;

                            // Run mobile-specific entrance animations (heading, list items, mobile CTA)
                            const listContainer = listRef.current;
                            const items = listContainer ? listContainer.querySelectorAll('.services-list-item') : [];
                            const mobileCta = listContainer ? listContainer.querySelector('.services-mobile-cta') : null;

                            // Heading reveal (staggered lines for mobile)
                            const headingSpans = heading.querySelectorAll('span');
                            gsap.set(headingSpans, { opacity: 0, y: 12 });
                            gsap.to(headingSpans, {
                                opacity: 1,
                                y: 0,
                                duration: 0.7,
                                ease: 'expo.out',
                                stagger: 0.12,
                                overwrite: true,
                            });

                            // Staggered list items
                            gsap.set(items, { opacity: 0, y: 30, scale: 0.96 });
                            gsap.to(items, {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.7,
                                ease: 'back.out(1.7)',
                                stagger: 0.15,
                            });

                            // Mobile CTA entrance
                            if (mobileCta) {
                                gsap.fromTo(mobileCta, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, delay: 0.4 });
                            }
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -20% 0px' });

                mobileObserver.observe(section);
            }

        // On mobile we keep heading centered and don't shift it left; just reveal lines.
        if (window.innerWidth <= 640) {
            gsap.set(yang, { opacity: 1, x: 0 });
            gsap.set(kami, { opacity: 1, x: 0 });
        } else {
            tl.to(heading, {
                x: () => {
                    const padding = window.innerWidth < 640 ? 16 : 48;
                    const maxShift = Math.max(0, heading.offsetLeft - padding);
                    // Kurangi jarak geser dengan multiplier (misal 60% dari jarak maksimal)
                    return `-${maxShift * 0.8}px`; // Ubah 0.6 sesuai kebutuhan (0.5 = 50%, 0.7 = 70%, dll)
                },
                textAlign: 'left',
                justifyContent: 'left',
                ease: 'expo.out',
            }, 0.1)
            .to(yang, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'expo.out',
                justifyContent: 'left',
            }, 0.1)
            .to(kami, {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'expo.out',
            }, 0.1);
        }

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
            tl.kill();
            if (mobileObserver) mobileObserver.disconnect();
            // Ensure mobile heading/list tweens are cleared
            try {
                const h = headingRef.current;
                h && gsap.killTweensOf(h);
            } catch (e) {}
        };
    }, []);

    // Position left CTA to align with heading left edge and just below it (desktop only)
    useEffect(() => {
        if (isMobile) return; // skip positioning on mobile (CTA placed inside list)
        const positionCta = () => {
            const heading = headingRef.current;
            const cta = leftCtaRef.current;
            const section = sectionRef.current;
            if (!heading || !cta || !section) return;

            const sectionRect = section.getBoundingClientRect();

            // Align CTA to section's left padding so it sits on the left side,
            // not relative to the centered heading.
            const leftPadding = Math.round(sectionRect.width * 0.05); // 5% padding from left edge
            const left = Math.max(8, leftPadding); // at least 8px from edge to avoid clipping

            // top just below heading; add small offset
            const top = Math.round(heading.getBoundingClientRect().bottom - sectionRect.top + (window.innerWidth < 640 ? 28 : 24));

            setCtaStyle({ left: `${left}px`, top: `${top}px`, position: 'absolute' });
        };

        // Initial position and on resize
        positionCta();
        window.addEventListener('resize', positionCta);

        return () => {
            window.removeEventListener('resize', positionCta);
        };
    }, [showServices, isMobile]);

    // Update isMobile on resize
    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth <= 640);
        };
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // ANIMASI: slide-in dari kanan untuk CTA (desktop only)
    useEffect(() => {
        if (isMobile) return; // CTA inside list on mobile
        const el = leftCtaRef.current;
        if (!el) return;

        // Set initial hidden state so it doesn't flash before animation
        gsap.set(el, { opacity: 0, x: 60 });

        let tween;
        if (showServices) {
            tween = gsap.fromTo(
                el,
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: 0.12 }
            );
        } else {
            tween = gsap.to(el, { x: 40, opacity: 0, duration: 0.35, ease: 'power2.in' });
        }

        return () => {
            tween && tween.kill && tween.kill();
            gsap.killTweensOf(el);
        };
    }, [showServices, isMobile]);

    // Animasi list services yang baru - staggered reveal dari bawah container
    useEffect(() => {
        if (showServices) {
            const listContainer = listRef.current;
            const items = listContainer ? Array.from(listContainer.querySelectorAll('.services-list-item')) : [];

            // Mulai dari bawah container (visual "masuk dari bawah")
            gsap.set(items, { opacity: 0, y: '100%', scale: 0.95 });

            gsap.to(items, {
                opacity: 1,
                y: 0, // Naik ke posisi normal
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                stagger: 0.18, // Stagger setiap 0.18 detik
                delay: 0.18, // Delay awal
            });

            // Also ensure heading lines are animated on mobile when showServices becomes true
            if (isMobile && headingRef.current) {
                const headingSpans = headingRef.current.querySelectorAll('span');
                gsap.set(headingSpans, { opacity: 0, y: 12 });
                gsap.to(headingSpans, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'expo.out',
                    stagger: 0.12,
                    overwrite: true,
                });
            }

            // Pastikan container mulai dari bawah agar efek 'dari bawah' terasa (scroll ke bottom)
            if (listContainer) {
                listContainer.scrollTop = Math.max(0, listContainer.scrollHeight - listContainer.clientHeight);
            }

            // PARALLAX: buat per-item parallax berdasarkan scroll dalam container
            const parallaxTweens = items.map(item => {
                return gsap.to(item, {
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        scroller: listContainer,
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            });

            // TILT: pointer / touch interaction per-item
            const pointerHandlers = [];
            items.forEach(item => {
                // Enable 3D transform on item via CSS (handled in CSS file)
                let rafId = null;
                const onPointerMove = (e) => {
                    const rect = item.getBoundingClientRect();
                    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
                    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
                    const px = (clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
                    const py = (clientY - rect.top) / rect.height - 0.5;

                    const rotY = px * 8; // degrees
                    const rotX = -py * 8;
                    const transZ = 8;

                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(() => {
                        item.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${transZ}px)`;
                        item.style.boxShadow = `${-rotY}px ${rotX}px 30px rgba(2,6,23,0.24)`;
                    });
                };
                const onPointerLeave = () => {
                    if (rafId) cancelAnimationFrame(rafId);
                    item.style.transform = '';
                    item.style.boxShadow = '';
                };
                item.addEventListener('pointermove', onPointerMove);
                item.addEventListener('pointerleave', onPointerLeave);
                item.addEventListener('touchmove', onPointerMove, { passive: true });
                item.addEventListener('touchend', onPointerLeave);

                pointerHandlers.push({ item, onPointerMove, onPointerLeave });
            });

            // Wheel handler di-attach ke container (semula). Biarkan per-item interactions tetap responsif
            const handleWheel = (e) => {
                if (!listContainer || listContainer.scrollHeight <= listContainer.clientHeight) return;

                const atTop = listContainer.scrollTop === 0;
                const atBottom = listContainer.scrollTop + listContainer.clientHeight >= listContainer.scrollHeight - 1;

                if (e.deltaY > 0) {
                    if (atBottom) {
                        e.preventDefault();
                        listContainer.scrollTop = Math.max(0, listContainer.scrollTop - e.deltaY);
                    } else {
                        e.preventDefault();
                        listContainer.scrollTop = Math.min(listContainer.scrollHeight - listContainer.clientHeight, listContainer.scrollTop + e.deltaY);
                    }
                } else if (e.deltaY < 0) {
                    if (!atTop) {
                        e.preventDefault();
                        listContainer.scrollTop = Math.max(0, listContainer.scrollTop + e.deltaY);
                    }
                }
            };

            listContainer && listContainer.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                // Cleanup wheel
                listContainer && listContainer.removeEventListener('wheel', handleWheel);
                // Cleanup pointer handlers
                pointerHandlers.forEach(({ item, onPointerMove, onPointerLeave }) => {
                    item.removeEventListener('pointermove', onPointerMove);
                    item.removeEventListener('pointerleave', onPointerLeave);
                    item.removeEventListener('touchmove', onPointerMove);
                    item.removeEventListener('touchend', onPointerLeave);
                });
                // Kill parallax ScrollTriggers and tweens
                parallaxTweens.forEach(t => {
                    try {
                        t.scrollTrigger && t.scrollTrigger.kill();
                    } catch (e) {}
                    try {
                        t.kill && t.kill();
                    } catch (e) {}
                });
            };
        }
    }, [showServices]);

    return (
        <section
            className="services-section relative flex items-center justify-center min-h-screen w-full overflow-hidden p-0"
            style={{ height: '100dvh', minHeight: '100vh' }}
            ref={sectionRef}
            data-theme="dark"
        >
            <div className="w-full flex flex-row items-center justify-between relative min-h-screen">
                <h2
                    ref={headingRef}
                    className="services-main-heading absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full flex flex-col items-center mt-4"
                >
                    <span className="block">Solusi</span>
                    <span
                        ref={yangRef}
                        style={{ opacity: 0, transform: 'translateX(1vw)', transition: 'opacity 0.3s, transform 0.3s' }}
                        className="inline-block ml-12 sm:ml-20 md:ml-32 lg:ml-40"
                    >
                        {' '}yang kami
                    </span>
                    <br />
                    <span
                        ref={kamiRef}
                        style={{ opacity: 0, transform: 'translateX(1vw)', transition: 'opacity 0.3s, transform 0.3s' }}
                        className="inline-block ml-12 sm:ml-20 md:ml-32 lg:ml-40"
                    >
                        Tawarkan.
                    </span>
                </h2>

                {/* Left CTA for desktop only (hidden on mobile) */}
                {!isMobile && (
                    <a
                        ref={leftCtaRef}
                        style={ctaStyle}
                        href={getWhatsAppUrl('services')}
                        className="services-left-cta"
                        role="button"
                        aria-label="Hubungi via WhatsApp"
                    >
                        Hubungi Kami
                    </a>
                )}

                {/* Services List - animasi baru staggered */}
                {showServices && (
                    <div className="services-list-container" ref={listRef} tabIndex="0" role="list">
                        {services.map((service, index) => (
                            <div key={index} className="services-list-item" role="listitem">
                                <h3 className="services-list-head">{service.head}</h3>
                                <p className="services-list-sub">{service.sub}</p>
                            </div>
                        ))}

                        {/* Mobile CTA (placed under list on mobile) */}
                        {isMobile && (
                            <a
                                href={getWhatsAppUrl('services')}
                                className="services-mobile-cta"
                                role="button"
                                aria-label="Hubungi via WhatsApp"
                            >
                                Hubungi Kami
                            </a>
                        )}

                    </div>
                )}
            </div>
        </section>
    );
}