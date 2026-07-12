import type { SiteContent } from "@/lib/types";

export default function Footer({ content }: { content: SiteContent }) {
  const mapQuery = encodeURIComponent(content.brand.mapsQuery || content.brand.address);
  const embedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const openMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <footer id="kontak" className="mt-20 bg-cream2 border-t border-gold/25 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-display font-semibold mb-2">Kontak Kami</div>
          <div className="text-ink/75">💬 {content.brand.whatsapp}</div>
          <div className="text-ink/75 mt-1">📸 {content.brand.instagram}</div>
        </div>
        <div>
          <div className="font-display font-semibold mb-2">Alamat</div>
          <div className="text-ink/75">📍 {content.brand.address}</div>
          <a
            href={openMapsUrl}
            target="_blank"
            className="inline-block mt-2 text-xs text-maroon border border-maroon rounded-full px-3 py-1.5 hover:bg-maroon hover:text-white transition"
          >
            Buka di Google Maps →
          </a>
        </div>
        <div>
          <div className="font-display font-semibold mb-2">Pembayaran</div>
          <div className="flex gap-2 mt-2">
            {["BSI", "BCA", "Mandiri", "QRIS"].map((b) => (
              <span key={b} className="px-2.5 py-1.5 bg-white rounded text-[10px] font-medium text-ink/70 border border-gold/30">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-8">
        <div className="rounded-xl overflow-hidden border border-gold/30 h-64">
          <iframe
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Dapur Embun"
          />
        </div>
      </div>

      <div className="text-center text-xs text-ink/50 pb-6">
        © {new Date().getFullYear()} {content.brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
