import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowRight, Star, Zap, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../css/sections.css';

gsap.registerPlugin(ScrollTrigger);

const Section7 = () => {
  const containerRef = useRef(null);
  const categoriesRef = useRef(null);
  const [activeTab, setActiveTab] = useState('landing');
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const ctx = gsap.context(() => {
        gsap.to('.reveal-price-head', {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        });

        gsap.utils.toArray('.reveal-price-card').forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 75%",
                scrub: 1
              }
            }
          );
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [inView]);

  useEffect(() => {
    if (inView) {
      gsap.fromTo('.reveal-price-card',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [activeTab, inView]);

  const categories = [
  { id: 'landing', label: 'Landing Page', icon: '🚀' },
  { id: 'portofolio', label: 'Portofolio Pribadi', icon: '📸' },
  { id: 'profil', label: 'Profil Usaha', icon: '🏢' },
  { id: 'toko', label: 'Toko Online Sederhana', icon: '🛒' },
];

const pricingData = {
  landing: [
    {
      name: "Landing Starter",
      price: "Rp1.300.000",
      featured: false,
      features: [
        "Domain .com Gratis 1 Tahun",
        "1 Halaman Long Scroll",
        "Desain Responsif Mobile & Desktop",
        "Hosting Shared 6 Bulan Gratis",
        "SSL Gratis",
        "Integrasi WhatsApp",
        "1x Revisi Gratis",
        "Maintenance 15 Hari",
        "Video Cara Kelola Website"
      ],
      suitable: "Buat promo cepat, event, atau jualan sederhana.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Landing%20Starter"
    },
    {
      name: "Landing Pro",
      price: "Rp2.750.000",
      featured: true,
      promo: "Paling Laris",
      features: [
        "Semua fitur Starter",
        "Hosting Full 1 Tahun",
        "Desain + Animasi Ringan",
        "Form Lead & CTA Kuat",
        "AI Chatbot Konsultasi + Soft Selling ke WA",
        "SEO Dasar (Meta + Speed)",
        "3x Revisi Gratis",
        "Maintenance 1 Bulan"
      ],
      suitable: "Ideal buat kumpulin leads atau kampanye marketing.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Landing%20Pro"
    },
    {
      name: "Landing Premium + AI Chatbot",
      price: "Rp3.750.000",
      featured: false,
      features: [
        "Semua fitur Starter & Pro",
        "Tambah 2 Halaman (About/FAQ/Testimoni/dll)",
        "Custom Animasi & Interaksi",
        "Optimasi Kecepatan Tinggi",
        "5x Revisi Gratis!",
        "Maintenance 2 Bulan",
        "Prioritas Support"
      ],
      suitable: "Buat brand yang mau tampil beda dan premium.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Landing%20Premium%20%2B%20AI%20Chatbot"
    }
  ],
  portofolio: [
    {
      name: "Portofolio Starter",
      price: "Rp750.000",
      featured: false,
      features: [
        "Desain Clean & Minimalis",
        "Hingga 5 Section (Home, About, Works, Contact)",
        "Responsif Mobile",
        "Domain Gratis 1 Tahun",
        "Hosting 6 Bulan",
        "Galeri Karya",
        "Form Kontak ke WA",
        "SSL Gratis",
        "Maintenance 15 Hari"
      ],
      suitable: "Cocok buat mahasiswa, freelancer, atau creator pemula.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Portofolio%20Starter"
    },
    {
      name: "Portofolio Pro",
      price: "Rp1.400.000",
      featured: true,
      promo: "Rekomendasi",
      features: [
        "Semua fitur Starter",
        "Hosting 1 Tahun",
        "Section Tambahan (Testimoni/Blog Mini)",
        "AI Chatbot untuk konsultasi klien langsung",
        "SEO Dasar",
        "3x Revisi",
        "Maintenance 1 Bulan"
      ],
      suitable: "Portofolio yang bisa narik klien otomatis via chat.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Portofolio%20Pro"
    },
    {
      name: "Portofolio Premium + AI Chatbot",
      price: "Rp2.200.000",
      featured: false,
      features: [
        "Semua fitur Pro",
        "Desain Custom + Animasi",
        "Unlimited Section/Galeri",
        "Integrasi Sosmed & Linktree Style",
        "5x Revisi",
        "Maintenance 1,5 Bulan",
        "Optimasi Mobile First"
      ],
      suitable: "Buat freelancer/creator yang mau kelihatan pro level.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Portofolio%20Premium"
    }
  ],
  profil: [
    {
      name: "Profil Usaha Starter",
      price: "Rp2.500.000",
      featured: false,
      features: [
        "Hingga 5-7 Halaman",
        "Desain Responsif",
        "Domain & Hosting 1 Tahun",
        "Galeri Produk/Layanan",
        "Form Kontak + WA",
        "SSL Gratis",
        "Maintenance 30 Hari"
      ],
      suitable: "Buat UMKM, cafe, klinik kecil, atau jasa lokal.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Profil%20Usaha%20Starter"
    },
    {
      name: "Profil Usaha Pro + AI Chatbot",
      price: "Rp4.000.000",
      featured: true,
      promo: "Best Value",
      features: [
        "Semua fitur Starter",
        "Desain Premium Clean",
        "Tambah Blog/News atau Halaman Team",
        "AI Chatbot jawab FAQ & konsultasi otomatis",
        "SEO On-Page Dasar",
        "Email Bisnis 1 Akun",
        "Maintenance 1,5 Bulan"
      ],
      suitable: "Usaha yang mau interaksi customer 24/7 tanpa ribet.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Profil%20Usaha%20Pro"
    },
    {
      name: "Profil Usaha Premium + AI Chatbot",
      price: "Rp6.500.000",
      featured: false,
      features: [
        "Semua fitur Pro",
        "Desain Custom Brand",
        "Halaman Tambahan Fleksibel",
        "Advanced SEO + Google Analytics",
        "2 Email Bisnis",
        "Maintenance 2 Bulan",
        "Prioritas Revisi & Support"
      ],
      suitable: "Buat bisnis yang sudah berkembang dan butuh tampilan upscale.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Profil%20Usaha%20Premium"
    }
  ],
  toko: [
    {
      name: "Toko Online Starter",
      price: "Rp2.500.000",
      featured: false,
      features: [
        "Max 50 Produk",
        "Keranjang Belanja",
        "Order via WhatsApp",
        "Desain Responsif",
        "Domain & Hosting 1 Tahun",
        "Admin Panel Sederhana",
        "SSL Gratis",
        "Maintenance 30 Hari"
      ],
      suitable: "Toko kecil yang masih handle order manual via WA.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Toko%20Online%20Starter"
    },
    {
      name: "Toko Online Pro + AI",
      price: "Rp6.000.000",
      featured: true,
      promo: "Popular",
      features: [
        "Unlimited Produk (realistis 100-300)",
        "Payment Gateway (Midtrans/Sejenis)",
        "Ongkir Otomatis Dasar",
        "AI Chatbot nanya stok & bantu closing",
        "SEO Dasar Toko",
        "Maintenance 2 Bulan"
      ],
      suitable: "Toko yang mau semi-otomatis dan kurangi chat manual.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Toko%20Online%20Pro"
    },
    {
      name: "Toko Online Premium + AI Chatbot",
      price: "Rp11.000.000",
      featured: false,
      features: [
        "Semua fitur Pro",
        "Desain Custom E-commerce",
        "Member/Login Area",
        "Multi Payment + Ongkir Lanjutan",
        "Advanced SEO",
        "Maintenance 3 Bulan",
        "Training 1 Jam via Zoom"
      ],
      suitable: "Buat toko yang sudah punya omzet dan mau scale up.",
      link: "https://wa.me/6285782338277?text=Saya%20mau%20paket%20Toko%20Online%20Premium"
    }
  ]
};

  const currentPlans = pricingData[activeTab];

  // Always put the MOST EXPENSIVE plan in the center and mark it as 'Paling Laris'
  const orderedPlans = useMemo(() => {
    if (!currentPlans || currentPlans.length <= 1) return currentPlans;

    // clone items (avoid mutating original objects)
    const arr = currentPlans.map((p) => ({ ...p }));
    const center = Math.floor(arr.length / 2);

    const parsePrice = (p) => {
      if (!p || !p.price) return -Infinity;
      const digits = String(p.price).replace(/[^\d]/g, '');
      return parseInt(digits || '0', 10);
    };

    // Find index of the highest priced plan
    const maxIdx = arr.reduce((bestIdx, item, idx) => {
      return parsePrice(item) > parsePrice(arr[bestIdx]) ? idx : bestIdx;
    }, 0);

    // Remove any existing 'Paling Laris' flags from other plans
    arr.forEach((p) => {
      if (p.promo && String(p.promo).toLowerCase().includes('paling laris')) {
        delete p.promo;
      }
    });

    // Take the most expensive plan out
    const [maxItem] = arr.splice(maxIdx, 1);

    // Mark it as the top promo
    maxItem.promo = 'Paling Laris';

    // Place it in the center index
    arr.splice(center, 0, maxItem);

    return arr;
  }, [currentPlans]);

  const scrollToCategories = () => {
    if (categoriesRef && categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (containerRef && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="pricing"
      ref={inViewRef}
      className="bg-natah-white text-natah-black section-padding"
      data-theme="light"
    >
      <div ref={containerRef} className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <div className="reveal-price-head gsap-reveal flex justify-center mb-4">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Promo Mahasiswa & UMKM 2026
            </span>
          </div>
          <h2 className="text-migra text-4xl md:text-5xl lg:text-6xl font-bold mb-6 reveal-price-head gsap-reveal">
            Paket Website Simpel & Cepat Jadi
          </h2>
          <p className="text-montreal text-lg opacity-70 reveal-price-head gsap-reveal max-w-2xl mx-auto">
            Mulai dari Rp750rb, termasuk AI Chatbot di paket Pro. Cocok buat mahasiswa, UMKM, dan pemula.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 reveal-price-head gsap-reveal">
          <div ref={categoriesRef} className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 md:px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${activeTab === cat.id
                  ? 'bg-natah-black text-natah-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {orderedPlans.map((plan, index) => {
            const centerIndex = Math.floor(orderedPlans.length / 2);
            const isCenter = index === centerIndex;
            const isRight = index === (orderedPlans.length - 1);
            const visualFeatured = isCenter || (!isRight && plan.featured);
            const cardClass = isCenter ? 'price-card--featured' : (isRight ? 'price-card--standard' : (plan.featured ? 'price-card--featured' : 'price-card--standard'));

            return (
              <div
                key={plan.name || index}
                className={`reveal-price-card gsap-reveal-stagger price-card ${cardClass} group`}
                data-theme="light"
              >
                {plan.promo && <span className="promo-badge">{plan.promo}</span>}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2 opacity-80 uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 flex-wrap justify-center">
                  <span className="text-3xl md:text-3xl lg:text-4xl font-bold leading-tight">{plan.price}</span>
                </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm">
                      <Check className={`w-5 h-5 flex-shrink-0 ${visualFeatured ? 'text-white' : 'text-green-500'}`} />
                      <span className="opacity-90 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all duration-300 ${visualFeatured
                    ? 'bg-white text-natah-black hover:bg-gray-100 hover:scale-105'
                    : 'bg-natah-black text-natah-white hover:bg-gray-800 hover:scale-105'
                  }`}
                >
                  Pilih Paket Ini
                  <ArrowRight className="w-4 h-4" />
                </a>
                {plan.suitable && (
                  <p className="text-montreal text-sm opacity-60 mt-3 text-center">{plan.suitable}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Add-on AI Chatbot & Maintenance */}
        <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="reveal-price-card gsap-reveal flex flex-col p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-natah-black p-3 rounded-lg text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Add-on AI Chatbot</h4>
                <p className="text-sm opacity-60">Konsultasi otomatis + soft closing ke WA</p>
              </div>
            </div>
            <div className="mt-auto">
              <span className="text-2xl font-bold">Rp600.000</span>
              <a href="https://wa.me/6285782338277?text=Saya%20mau%20tambah%20AI%20Chatbot" className="text-sm font-bold underline hover:opacity-70 ml-4">
                Tanya Detail
              </a>
            </div>
          </div>

          <div className="reveal-price-card gsap-reveal flex flex-col p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-natah-black p-3 rounded-lg text-white">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Add-on Maintenance</h4>
                <p className="text-sm opacity-60">Update & keamanan rutin</p>
              </div>
            </div>
            <div className="mt-auto">
              <span className="text-2xl font-bold">Rp150.000 <span className="text-xs opacity-50">/ 6 bulan</span></span>
              <a href="https://wa.me/6285782338277?text=Saya%20mau%20tanya%20Maintenance" className="text-sm font-bold underline hover:opacity-70 ml-4">
                Tanya Detail
              </a>
            </div>
          </div>
        </div>

        {/* Mobile shortcut button: scrolls to category tabs (mobile only, inline under section) */}
        <button
          type="button"
          onClick={scrollToCategories}
          className="md:hidden mt-8 w-full bg-natah-black text-natah-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          aria-label="Pilih Kategori"
        >
          Pilih Kategori
        </button>
      </div>
    </section>
  );
};

export default Section7;