export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    whatsapp: string;
    instagram: string;
    address: string;
    mapsQuery: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    image: string;
  };
  about: string;
  nav: string[];
};

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  images: string[];
  category: string;
  position: number;
};

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "Dapur Embun",
    tagline: "Delicious and Halal Cake",
    whatsapp: "08777 250 7783",
    instagram: "@dapurembun",
    address: "Samosir Viewers Road, Airport, Maharlika 4, Matanao, Manila",
    mapsQuery: "Samosir Viewers Road, Airport, Maharlika 4, Matanao, Manila"
  },
  hero: {
    title: "Cita Rasa Hangat, Kelezatan Halal",
    subtitle: "Kue Premium Dapur Embun, Dijamin Halal & Menggugah Selera",
    cta: "Pesan Sekarang",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1400&auto=format&fit=crop"
  },
  about: "Kue Premium Dapur Embun, menawarkan aneka kue dengan bahan pilihan, dibuat secara higienis, dengan cita rasa yang lezat dan pastinya HALAL. Cocok untuk berbagai momen spesial Anda.",
  nav: ["Home", "Katalog Kue", "Tentang Kami", "Testimoni", "Kontak"]
};
