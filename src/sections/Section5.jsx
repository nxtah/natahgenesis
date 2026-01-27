import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Zap, MessageCircle, Heart, Star, Check } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../css/sections.css';

gsap.registerPlugin(ScrollTrigger);

const Section5 = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    const { ref: inViewRef, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            const ctx = gsap.context(() => {
                // Main title reveal (standard)
                gsap.to('.reveal-title', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power4.out',
                });

                // Cards Stagger + Parallax
                // Instead of just revealing, they move slightly at different speeds while scrolling
                gsap.utils.toArray('.reveal-card').forEach((card, i) => {
                    gsap.fromTo(card,
                        { opacity: 0, y: 100 },
                        {
                            opacity: 1,
                            y: 0,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%",
                                end: "top 70%",
                                scrub: 1,
                            }
                        }
                    );
                });



                // Text reveal
                gsap.to('.reveal-founder', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.reveal-founder',
                        start: "top 80%",
                    }
                });

                // Pinning logic for Curtain Effect
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "bottom bottom",
                    end: "+=150%", // Increased duration to ensure Section 6 has plenty of time to cover it
                    pin: true,
                    pinSpacing: false,
                    anticipatePin: 1, // Fixes jitter/flicker during pinning
                    immediateRender: false
                });
            }, containerRef);

            return () => ctx.revert();
        }
    }, [inView]);

    const features = [
        {
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            title: "Harga Sangat Terjangkau",
            desc: "Super terjangkau, khusus untuk membantu UMKM & individu di awal perjalanan digital mereka."
        },
        {
            icon: <Zap className="w-8 h-8 text-blue-500" />,
            title: "Setup Cepat 5–7 Hari",
            desc: "Tidak perlu menunggu berbulan-bulan. Website Anda siap tayang dalam hitungan hari saja."
        },
        {
            icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
            title: "Support Personal via WA",
            desc: "Ada kendala? Chat langsung. Kami bantu sampai tuntas dengan pendekatan personal."
        },
        {
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: "Fokus UMKM & Job Seeker",
            desc: "Kami mengerti kebutuhan Anda. Solusi tepat guna untuk portofolio atau toko online."
        },
        {
            icon: <Star className="w-8 h-8 text-yellow-500" />,
            title: "Kualitas Terbaik",
            desc: "Desain & implementasi berkualitas tinggi — dioptimalkan untuk performa dan aksesibilitas."
        },
        {
            icon: <Check className="w-8 h-8 text-green-500" />,
            title: "101% Terima Jadi",
            desc: "Pengerjaan selesai hingga serah terima; website siap dipakai tanpa ribet."
        }
    ];

    return (
        <section
            id="why-us"
            ref={(el) => {
                inViewRef(el);
                sectionRef.current = el;
            }}
            className="bg-natah-white text-natah-black section-padding overflow-hidden relative z-0 pb-48"
        >
            <div ref={containerRef} className="container mx-auto px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
                    <h2 className="text-migra text-4xl md:text-5xl lg:text-6xl font-bold mb-6 reveal-title gsap-reveal">
                        Kenapa Harus Sama Kami?
                    </h2>
                    <p className="text-montreal text-lg md:text-xl opacity-80 reveal-title gsap-reveal">
                        Kami bukan sekadar agensi. Kami adalah partner pertumbuhan Anda yang mengutamakan kecepatan, keterjangkauan, dan hasil nyata.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="reveal-card gsap-reveal-stagger p-8 rounded-2xl border border-gray-100 bg-white card-hover flex flex-col items-start text-left"
                        >
                            <div className="mb-4">{item.icon}</div>
                            <h3 className="text-migra text-2xl font-bold mb-3">{item.title}</h3>
                            <p className="text-montreal opacity-70 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Value Proposition - Typographic Layout */}
                <div className="reveal-founder gsap-reveal max-w-7xl mx-auto mt-32">
                    <div className="border-t border-natah-black/10 pt-10 mb-16">
                        <h3 className="text-migra text-[clamp(3rem,7vw,7rem)] leading-[0.9] font-normal">
                            Bukan Sekadar <br />
                            <span className="text-gray-400 italic ml-6 md:ml-32">Website Template.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                        <div className="md:col-span-5 md:col-start-1">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6">Our Standard</p>
                            <p className="text-montreal text-xl md:text-2xl opacity-90 leading-relaxed">
                                Kami menolak standar "asal ada". Website kamu dibangun dengan teknologi modern dengan kombinasi AI untuk Customer Service 24/ untuk membantu kamu dalam closing awal.
                            </p>
                        </div>
                        <div className="md:col-span-3 md:col-start-9 flex flex-row md:flex-col gap-12 md:border-l border-natah-black/10 md:pl-12">
                            <div>
                                <p className="font-heading text-5xl md:text-6xl font-bold">99<span className="text-xl align-top">%</span></p>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mt-2">Google Performance</p>
                            </div>
                            <div>
                                <p className="font-heading text-5xl md:text-6xl font-bold">100<span className="text-xl align-top">%</span></p>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mt-2">Responsive Mobile</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Section5;
