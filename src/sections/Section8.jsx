import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote, Star, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import gsap from 'gsap';
import '../css/sections.css';

const Section8 = () => {
    const containerRef = useRef(null);
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    // --- LOGIC DRAG TETAP (CUMA TWEAK SPEED) ---
    const handleMouseDown = (e) => {
        if (!sliderRef.current) return;
        isDown.current = true;
        setIsDragging(true);
        startX.current = e.pageX - sliderRef.current.offsetLeft;
        scrollLeft.current = sliderRef.current.scrollLeft;
        sliderRef.current.style.scrollSnapType = 'none';
        sliderRef.current.style.cursor = 'grabbing';
    };

    const handleMouseLeaveOrUp = () => {
        if (!isDown.current) return;
        isDown.current = false;
        setIsDragging(false);
        if (sliderRef.current) {
            sliderRef.current.style.cursor = 'grab';
            sliderRef.current.style.scrollSnapType = 'x mandatory';
            sliderRef.current.style.scrollBehavior = 'smooth';
            setTimeout(() => {
                if (sliderRef.current) sliderRef.current.style.scrollBehavior = 'auto';
            }, 500);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDown.current || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.8;
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };



    const testimonials = [
        { name: "Andi Saputra", role: "Owner Kopi Lokal", content: "Prosesnya beneran cepet! Awalnya bingung mau mulai dari mana, tapi tim Natah bantu arahin sampe website jualan saya live cuma dalam seminggu.", stars: 5 },
        { name: "Siti Aminah", role: "Freelance Designer", content: "Portofolio saya jadi kelihatan jauh lebih profesional. Sekarang lebih pede kalau kirim link ke calon klien. Desainnya clean banget!", stars: 5 },
        { name: "Budi Santoso", role: "UMKM Pakaian Anak", content: "Harganya paling masuk akal buat saya yang baru mau go digital. Sudah termasuk hosting pula, jadi nggak usah pusing bayar-bayar lagi.", stars: 5 },
        { name: "Dewi Lestari", role: "Founder Skincare Lokal", content: "Website saya sekarang terlihat sangat modern dan menarik. Banyak customer baru yang datang karena impressed dengan tampilan website.", stars: 5 }
    ];

    return (
        <section id="testimonials" ref={inViewRef} className="bg-natah-black text-natah-white py-20 overflow-hidden relative select-none" data-theme="dark">
            <div ref={containerRef} className="container mx-auto px-6 md:px-12">

                {/* Header (Desain Asli Kamu) */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-migra text-4xl md:text-6xl font-bold mb-6 reveal-testi-head">
                        Apa Kata Client Kami?
                    </h2>
                    <p className="text-montreal text-lg md:text-xl opacity-60 mb-8 reveal-testi-head">
                        Testimoni client pertama sedang kami kumpulkan — segera hadir cerita sukses lainnya!
                    </p>

                    {/* Swipe hint (replaces progress bar) */}
                    <div className="mb-6 reveal-testi-head">
                        <div className="swipe-hint inline-flex items-center gap-3 px-3 py-2 rounded-full bg-white/5 mx-auto text-sm text-white/80 select-none">
                            <div className="chev-group flex items-center gap-1">
                                <ChevronLeft className="chev w-4 h-4 opacity-70" />
                                <MoveHorizontal className="chev middle w-5 h-5 opacity-90" />
                                <ChevronRight className="chev w-4 h-4 opacity-70" />
                            </div>
                            <span className="hidden sm:inline">Geser untuk melihat</span>
                            <span className="sm:hidden">Geser</span>
                        </div>
                    </div>
                </div>

                {/* SLIDER - Dibuat "Besar & Mentok" */}
                <div className="relative -mx-6 md:-mx-12 lg:-mx-24">
                    <div
                        ref={sliderRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveOrUp}
                        onMouseUp={handleMouseLeaveOrUp}
                        onMouseMove={handleMouseMove}
                        className={`
                            flex gap-6 md:gap-10
                            overflow-x-auto 
                            snap-x snap-mandatory 
                            no-scrollbar 
                            px-6 md:px-12 lg:px-24 /* Padding agar card pertama/akhir pas di tengah */
                            cursor-grab ${isDragging ? 'cursor-grabbing' : ''}
                        `}
                    >
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    flex-shrink-0 snap-center
                                    /* UKURAN RAKSASA SESUAI REQUEST */
                                    w-[88vw] md:w-[85vw] lg:w-[80vw] 
                                    min-h-[450px] md:min-h-[550px]
                                    
                                    /* DESAIN ASLI KAMU (Liquid Glass) */
                                    p-8 md:p-16 liquid-glass relative border border-white/10 rounded-[3rem] 
                                    flex flex-col justify-between group
                                `}
                            >
                                {/* Quote Icon (Asli Kamu) */}
                                <div className="absolute top-8 right-8 text-white/5">
                                    <Quote className="w-20 h-20 md:w-32 md:h-32 fill-current" />
                                </div>

                                {/* Card Number (Asli Kamu) */}
                                <div className="absolute top-8 left-8 text-white/10 font-bold text-7xl md:text-9xl font-migra">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <div className="relative z-10 mt-20">
                                    {/* Stars (Asli Kamu) */}
                                    <div className="flex gap-1.5 mb-8 text-yellow-400">
                                        {[...Array(item.stars)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 md:w-7 md:h-7 fill-current" />
                                        ))}
                                    </div>

                                    {/* Testimonial Content (Asli Kamu tapi Upscale) */}
                                    <p className="text-montreal text-2xl md:text-4xl lg:text-5xl mb-8 leading-tight font-normal opacity-90">
                                        "{item.content}"
                                    </p>
                                </div>

                                {/* Author Info (Asli Kamu) */}
                                <div className="flex items-center gap-6 relative z-10 mt-auto">
                                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl md:text-3xl border-2 border-white/20 shadow-xl">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-heading text-xl md:text-3xl font-bold">{item.name}</p>
                                        <p className="text-sm md:text-lg opacity-60 tracking-widest uppercase mt-1">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlays (Asli Kamu) */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-natah-black to-transparent pointer-events-none z-20" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-natah-black to-transparent pointer-events-none z-20" />
                </div>
            </div>
        </section>
    );
};

export default Section8;