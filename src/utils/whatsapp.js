// Utility for WhatsApp CTA links with pre-filled messages

const BASE_URL = "https://wa.me/6285782338277?text=";

export const WA_MESSAGES = {
  business:
    "Halo Natah Genesis! Saya punya bisnis dan lagi cari website yang simpel tapi profesional. Saya lihat layanannya menarik, boleh jelasin paket dan estimasi biayanya?",

  portfolio:
    "Halo Natah Genesis! Saya ingin bikin website portfolio untuk keperluan kerja/freelance. Bisa jelasin alurnya dan apa saja yang saya dapatkan?",

  general:
    "Halo Natah Genesis! Saya tertarik konsultasi soal pembuatan website. Pengen tanya-tanya dulu, apakah bisa dibantu?",
};

export function getWhatsAppUrl(type = "general") {
  const msg = encodeURIComponent(WA_MESSAGES[type] || WA_MESSAGES.general);
  return `${BASE_URL}${msg}`;
}
