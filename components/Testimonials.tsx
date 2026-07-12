const SAMPLE_TESTIMONIALS = [
  {
    name: "Sarah A.",
    text: "Kuenya lembut banget dan rasanya pas, gak terlalu manis. Anak-anak suka!",
    rating: 5
  },
  {
    name: "Budi R.",
    text: "Pesan untuk acara kantor, semua tamu tanya di mana belinya. Recommended!",
    rating: 5
  },
  {
    name: "Nina W.",
    text: "Pelayanan ramah, pengiriman tepat waktu, dan kuenya fresh banget.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimoni" className="max-w-6xl mx-auto px-5 mt-20 text-center scroll-mt-24">
      <h2 className="font-display text-2xl md:text-3xl font-semibold">Testimoni</h2>
      <div className="divider" />
      <p className="mt-4 text-sm text-ink/60 max-w-lg mx-auto">Apa kata pelanggan tentang Dapur Embun</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left">
        {SAMPLE_TESTIMONIALS.map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-[0_6px_24px_-8px_rgba(60,30,10,0.15)]">
            <div className="text-gold text-sm mb-2">{"★".repeat(t.rating)}</div>
            <p className="text-sm text-ink/75 leading-relaxed">&quot;{t.text}&quot;</p>
            <div className="mt-4 font-display font-semibold text-sm">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
