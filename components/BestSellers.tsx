import type { Product } from "@/lib/types";

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="max-w-6xl mx-auto px-5 mt-16 text-center">
      <h2 className="font-display text-2xl md:text-3xl font-semibold">Best Sellers</h2>
      <div className="divider" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-left">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-[0_6px_24px_-8px_rgba(60,30,10,0.15)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} className="w-full h-40 object-cover" alt={p.name} />
            <div className="p-4">
              <div className="font-display font-semibold text-base">{p.name}</div>
              <div className="text-xs text-ink/60 mt-1 leading-relaxed">{p.desc}</div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-maroon font-semibold text-sm">{p.price}</span>
                <span className="w-8 h-8 rounded-full bg-cream2 flex items-center justify-center text-maroon">🛒</span>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-sm text-ink/50 py-10">Belum ada produk. Tambahkan lewat Admin Panel.</p>
        )}
      </div>
    </section>
  );
}
