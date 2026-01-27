import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { MessageSquare, FileText, Code, Rocket, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../css/sections.css';

gsap.registerPlugin(ScrollTrigger);

const Section6 = () => {
    const containerRef = useRef(null);
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            const ctx = gsap.context(() => {
                // Title and subtitle
                gsap.to('.reveal-head', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                });

                // Desktop Timeline Line (Horizontal)
                gsap.fromTo('.timeline-path',
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 60%",
                            end: "bottom 80%",
                            scrub: 1,
                        }
                    }
                );

                // Mobile Timeline Line (Vertical) - targeting the vertical line div
                gsap.fromTo('.timeline-line-vertical',
                    { scaleY: 0, transformOrigin: 'top center' },
                    {
                        scaleY: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.timeline-line-vertical', // use the line itself as trigger or container
                            start: "top 70%",
                            end: "bottom 70%",
                            scrub: 1,
                        }
                    }
                );

                // Timeline Items: Reveal progressively with scrub
                // Using a straightforward reveal that feels controlled
                gsap.utils.toArray('.timeline-item').forEach((item, i) => {
                    gsap.fromTo(item,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: item,
                                start: "top 85%",
                                end: "top 65%",
                                scrub: 1, // tied to scroll
                            }
                        }
                    );
                });

            }, containerRef);

            return () => ctx.revert();
        }
    }, [inView]);

    const steps = [
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: "Konsultasi Gratis via WA",
            desc: "Diskusi kebutuhan Anda, target audience, dan fitur yang diinginkan secara santai."
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Mockup + Proposal",
            desc: "Kami buatkan draft desain awal dan rincian biaya yang transparan."
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Pembuatan & Revisi",
            desc: "Proses coding backend & frontend dimulai. Anda bebas memberikan revisi."
        },
        {
            icon: <Rocket className="w-8 h-8" />,
            title: "Launch + Training",
            desc: "Website live! Kami ajarkan cara update konten sederhana secara mandiri."
        }
    ];

    return (
        <section
            id="process"
            ref={inViewRef}
            className="bg-natah-black text-natah-white section-padding overflow-hidden relative z-20"
            data-theme="dark"
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div ref={containerRef} className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20 lg:mb-28">
                    <h2 className="text-migra text-4xl md:text-5xl lg:text-6xl font-bold mb-6 reveal-head gsap-reveal">
                        Prosesnya Mudah, Cuma 4 Langkah
                    </h2>
                    <p className="text-montreal text-lg md:text-xl opacity-60 reveal-head gsap-reveal">
                        Kami menyederhanakan proses digitalisasi agar Anda bisa tetap fokus pada bisnis Anda.
                    </p>
                </div>

                {/* Timeline Desktop */}
                <div className="hidden lg:block relative mb-32">
                    <div className="timeline-line timeline-path origin-left scale-x-0"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {steps.map((step, index) => (
                            <div key={index} className="timeline-item gsap-reveal-stagger flex flex-col items-center text-center">
                                <div className="relative mb-10">
                                    <div className="timeline-dot"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 rounded-full blur-sm -z-10 animate-pulse"></div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm card-hover h-full">
                                    <div className="flex justify-center mb-6 text-white/90">{step.icon}</div>
                                    <h3 className="text-migra text-2xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-montreal text-sm opacity-60 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Mobile/Tablet */}
                <div className="lg:hidden relative">
                    <div className="timeline-line-vertical h-[calc(100%-120px)] top-10"></div>
                    <div className="flex flex-col gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="timeline-item gsap-reveal-stagger relative flex gap-8">
                                <div className="flex-shrink-0 relative">
                                    <div className="timeline-dot"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full blur-sm -z-10"></div>
                                </div>
                                <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                                    <div className="text-white/90 mb-4">{step.icon}</div>
                                    <h3 className="text-migra text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-montreal text-sm opacity-60 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 text-white/40 mb-6">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Bebas Konsultasi Kapan Saja</span>
                    </div>
                    <br />
                    <a
                        href="https://wa.me/6285782338277?text=Saya%20ingin%20tanya%20mengenai%20langkah%20awal%20pembuatan%20website"
                        className="inline-flex items-center gap-3 bg-white text-natah-black font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform text-lg"
                    >
                        Mulai Diskusi Sekarang
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Section6;
