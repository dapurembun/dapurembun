import type { SiteContent } from "@/lib/types";

export default function About({ content }: { content: SiteContent }) {
  return (
    <section id="tentang" className="max-w-3xl mx-auto px-5 mt-20 text-center scroll-mt-24">
      <h2 className="font-display text-2xl md:text-3xl font-semibold">Tentang Kami</h2>
      <div className="divider" />
      <p className="mt-6 text-sm md:text-[15px] leading-relaxed text-ink/75">{content.about}</p>
    </section>
  );
}
