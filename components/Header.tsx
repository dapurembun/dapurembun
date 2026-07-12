import Logo from "./Logo";
import type { SiteContent } from "@/lib/types";

function linkFor(label: string) {
  const l = label.toLowerCase();
  if (l.includes("katalog")) return "/katalog";
  if (l.includes("home")) return "/#home";
  if (l.includes("tentang")) return "/#tentang";
  if (l.includes("testimoni")) return "/#testimoni";
  if (l.includes("kontak")) return "/#kontak";
  return "/";
}

export default function Header({ content }: { content: SiteContent }) {
  return (
    <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <a href="/" className="flex items-center gap-3">
          <Logo size={46} />
          <div>
            <div className="font-display text-lg font-semibold leading-tight">{content.brand.name}</div>
            <div className="text-[11px] tracking-wide text-ink/60">{content.brand.tagline}</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {content.nav.map((n, i) => (
            <a
              key={n}
              href={linkFor(n)}
              className={`text-sm font-medium transition ${
                i === 0 ? "text-maroon border-b-2 border-maroon pb-1" : "text-ink/80 hover:text-maroon"
              }`}
            >
              {n}
            </a>
          ))}
        </nav>
        <a
          href="/admin/dashboard"
          className="text-xs px-3 py-1.5 rounded-full border border-maroon text-maroon hover:bg-maroon hover:text-white transition"
        >
          ⚙ Admin
        </a>
      </div>
    </header>
  );
}
