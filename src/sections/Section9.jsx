import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, Send, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../css/sections.css';

gsap.registerPlugin(ScrollTrigger);

const Section9 = () => {
    const containerRef = useRef(null);
    const [showFloating, setShowFloating] = useState(false);

    const { ref: inViewRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            const ctx = gsap.context(() => {
                gsap.to('.reveal-contact-head', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                });

                gsap.to('.reveal-contact-item', {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 0.3,
                });

                // Form scales up as you scroll to it
                gsap.fromTo('.reveal-form',
                    { opacity: 0, scale: 0.9, y: 50 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.reveal-form',
                            start: "top 85%",
                            end: "top 60%",
                            scrub: 1
                        }
                    }
                );
            }, containerRef);

            return () => ctx.revert();
        }
    }, [inView]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setShowFloating(true);
            } else {
                setShowFloating(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id="contact"
            ref={inViewRef}
            className="bg-natah-white text-natah-black section-padding scroll-mt-20"
            data-theme="light"
        >
            <div ref={containerRef} className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

                    {/* Left Side: Info */}
                    <div className="lg:w-2/5 text-left">
                        <h2 className="text-migra text-4xl md:text-5xl lg:text-6xl font-bold mb-8 reveal-contact-head gsap-reveal">
                            Siap Mulai Digitalisasi Anda?
                        </h2>
                        <p className="text-montreal text-lg opacity-70 mb-12 reveal-contact-head gsap-reveal">
                            Hubungi kami untuk konsultasi gratis atau isi form di samping. Kami akan kembali kepada Anda dalam waktu kurang dari 5 menit!
                        </p>

                        <div className="space-y-8">
                            <div className="reveal-contact-item gsap-reveal flex items-center gap-5 -translate-x-10 opacity-0">
                                <div className="bg-gray-100 p-4 rounded-2xl">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-50 font-bold uppercase tracking-wider">WhatsApp</p>
                                    <a href="https://wa.me/6285782338277" className="text-lg font-bold hover:underline">0857-8233-8277</a>
                                </div>
                            </div>

                            <div className="reveal-contact-item gsap-reveal flex items-center gap-5 -translate-x-10 opacity-0">
                                <div className="bg-gray-100 p-4 rounded-2xl">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-50 font-bold uppercase tracking-wider">Email</p>
                                    <a href="mailto:natahgenesis@gmail.com" className="text-lg font-bold hover:underline">natahgenesis@gmail.com</a>
                                </div>
                            </div>

                            <div className="reveal-contact-item gsap-reveal flex items-center gap-5 -translate-x-10 opacity-0">
                                <div className="bg-gray-100 p-4 rounded-2xl">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-50 font-bold uppercase tracking-wider">Lokasi</p>
                                    <p className="text-lg font-bold">Indonesia (Remote / Hybrid)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:w-3/5 w-full">
                        <div className="reveal-form opacity-0 scale-95 bg-natah-black text-natah-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <MessageCircle className="w-32 h-32" />
                            </div>

                            <h3 className="text-migra text-3xl font-bold mb-8 relative z-10">Kirim Pesan Cepat</h3>

                            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Nama Lengkap</label>
                                        <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 focus:border-white focus:outline-none transition-colors" placeholder="Masukkan nama..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Nomor WhatsApp</label>
                                        <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 focus:border-white focus:outline-none transition-colors" placeholder="0857..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Pesan Singkat</label>
                                    <textarea className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 h-32 focus:border-white focus:outline-none transition-colors resize-none" placeholder="Ceritakan kebutuhan website Anda..."></textarea>
                                </div>
                                <button
                                    className="w-full bg-white text-natah-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors group"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Kirim ke WhatsApp Kami
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/6285782338277?text=Halo%20Natah,%20saya%20tertarik%20konsultasi%20langsung"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Konsultasi via WhatsApp"
                className={`fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 flex items-center md:gap-3 gap-0 md:pr-6 pr-4 ${showFloating ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
            >
                <div className="relative">
                    <MessageCircle className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>
                {/* Mobile: icon only. Desktop: show text */}
                <span className="font-bold text-sm hidden md:inline">Ada Pertanyaan?</span>
            </a>
        </section>
    );
};

export default Section9;
