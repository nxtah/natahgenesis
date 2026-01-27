import React from "react";

/**
 * Editorial Footer: Minimal, premium, creative studio style.
 */
export default function Footer() {
  return (
    <footer id="footer" className="relative w-full min-h-screen bg-natah-black text-natah-white flex flex-col justify-between px-6 md:px-12 xl:px-24 py-12 md:py-24" data-theme="dark">
      {/* Top Section: Links & Info */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-12">
        <div className="space-y-6 max-w-sm">
          <h5 className="text-sm font-bold opacity-50 uppercase tracking-widest">Tentang Kami</h5>
          <p className="text-xl md:text-2xl font-body leading-relaxed">
            Membantu bisnis lokal dan visioner membangun aset digital mereka. Cepat, terjangkau, dan dibuat dengan sepenuh hati.
          </p>
          <a href="mailto:natahgenesis@gmail.com" className="inline-block text-lg border-b border-white/30 hover:border-white transition-colors pb-1">
            natahgenesis@gmail.com
          </a>
        </div>

        <div className="flex gap-12 md:gap-24 text-base">
          <div className="flex flex-col gap-4">
            <h6 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-2">Menu</h6>
            <a href="#hero" className="hover:text-gray-400 transition-colors">Beranda</a>
            <a href="#services" className="hover:text-gray-400 transition-colors">Layanan</a>
            <a href="#why-us" className="hover:text-gray-400 transition-colors">Keunggulan</a>
            <a href="#process" className="hover:text-gray-400 transition-colors">Proses</a>
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-2">Sosial Media</h6>
            <a href="https://www.instagram.com/natahgenesis" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/natahgenesis" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">LinkedIn</a>
            <a href="https://api.whatsapp.com/send/?phone=6285782338277&text=Halo+Natah+Genesis%21+Saya+tertarik+konsultasi+soal+pembuatan+website.+Pengen+tanya-tanya+dulu%2C+apakah+bisa+dibantu%3F&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 overflow-hidden">
        <h1 className="text-[12vw] leading-none font-heading font-normal tracking-tighter text-center whitespace-nowrap opacity-20 select-none">
          NATAH GENESIS
        </h1>
      </div>

      {/* Bottom Section: Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full pt-8 border-t border-white/10 text-sm opacity-50 gap-4">
        <div>
          &copy; {new Date().getFullYear()} Natah Genesis. Hak Cipta Dilindungi.
        </div>
        <div className="flex gap-6">
          <span>Jakarta, Indonesia</span>
          <span>Remote First</span>
        </div>
      </div>
    </footer>
  );
}
