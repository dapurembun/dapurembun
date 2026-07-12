import type { SiteContent } from "@/lib/types";

export default function Hero({ content }: { content: SiteContent }) {
  const waNumber = content.brand.whatsapp.replace(/\D/g, "");
  return (
    <section id="home" className="relative scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 pt-8">
        <div className="relative rounded-2xl overflow-hidden shadow-[0_6px_24px_-8px_rgba(60,30,10,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.hero.image}
            className="w-full h-[380px] md:h-[460px] object-cover"
            alt="hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-14 max-w-xl">
              <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-ink">
                {content.hero.title}
              </h1>
              <p className="mt-4 text-sm md:text-base text-ink/75">{content.hero.subtitle}</p>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-sm font-medium bg-maroon text-white hover:bg-maroonDark transition"
              >
                📞 {content.hero.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
