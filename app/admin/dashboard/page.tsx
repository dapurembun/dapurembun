"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { DEFAULT_CONTENT, type Product, type SiteContent } from "@/lib/types";
import Logo from "@/components/Logo";

type Tab = "hero" | "brand" | "products" | "about" | "nav";

const DEFAULT_CATEGORIES = ["Custom Birthday Cakes", "Brulee Cake", "Puding", "Hantaran"];

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<Tab>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      setCheckingAuth(false);

      const { data: contentRow } = await supabase.from("site_content").select("value").eq("key", "main").maybeSingle();
      const { data: productsData } = await supabase.from("products").select("*").order("position", { ascending: true });
      if (contentRow?.value) setContent(contentRow.value as SiteContent);
      if (productsData)
        setProducts(
          (productsData as any[]).map((p) => ({
            ...p,
            images: p.images ?? [],
            category: p.category ?? "Lainnya"
          })) as Product[]
        );
      setLoading(false);
    })();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function saveContent() {
    setSaving(true);
    setStatus("");
    const { error } = await supabase.from("site_content").upsert({ key: "main", value: content });
    setSaving(false);
    setStatus(error ? `Gagal: ${error.message}` : "Tersimpan ✓");
    setTimeout(() => setStatus(""), 6000);
  }

  async function saveProduct(p: Product) {
    setSaving(true);
    const { error } = await supabase.from("products").upsert(p);
    setSaving(false);
    setStatus(error ? `Gagal: ${error.message}` : "Tersimpan ✓");
    setTimeout(() => setStatus(""), 6000);
  }

  async function addProduct() {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: "Nama Kue Baru",
      desc: "Deskripsi singkat",
      price: "Rp 0",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
      images: [],
      category: "Lainnya",
      position: products.length
    };
    const { error } = await supabase.from("products").insert(newProduct);
    if (!error) setProducts([...products, newProduct]);
  }

  async function removeProduct(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter((p) => p.id !== id));
  }

  function updateProductLocal(id: string, field: keyof Product, value: any) {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function handleImageUpload(file: File, id: string) {
    setUploadingId(id);
    const ext = file.name.split(".").pop();
    const path = `products/${id}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (!uploadError) {
      const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
      updateProductLocal(id, "image", pub.publicUrl);
    }
    setUploadingId(null);
  }

  async function handleGalleryUpload(file: File, p: Product) {
    setUploadingId(p.id + "-gallery");
    const ext = file.name.split(".").pop();
    const path = `products/${p.id}-gallery-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (!uploadError) {
      const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
      updateProductLocal(p.id, "images", [...(p.images || []), pub.publicUrl]);
    }
    setUploadingId(null);
  }

  function removeGalleryImage(p: Product, idx: number) {
    const next = [...(p.images || [])];
    next.splice(idx, 1);
    updateProductLocal(p.id, "images", next);
  }

  async function handleHeroImageUpload(file: File) {
    setUploadingId("hero");
    const ext = file.name.split(".").pop();
    const path = `hero/hero-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (!uploadError) {
      const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
      setContent({ ...content, hero: { ...content.hero, image: pub.publicUrl } });
    }
    setUploadingId(null);
  }

  if (checkingAuth || loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-ink/50">Memuat...</div>;
  }

  const tabs: [Tab, string][] = [
    ["hero", "Hero"],
    ["brand", "Identitas & Kontak"],
    ["products", "Produk & Katalog"],
    ["about", "Tentang Kami"],
    ["nav", "Navigasi"]
  ];

  const usedCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map((p) => p.category).filter(Boolean)]));

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-64 shrink-0 bg-white border-r border-gold/20 p-5 hidden md:flex md:flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Logo size={36} />
          <div className="font-display font-semibold text-sm">Admin Panel</div>
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                tab === key ? "bg-maroon text-white" : "text-ink/70 hover:bg-cream2"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 flex flex-col gap-2">
          {status && <div className="text-xs text-center text-green-700">{status}</div>}
          {tab !== "products" && (
            <button onClick={saveContent} disabled={saving} className="bg-maroon hover:bg-maroonDark text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-60">
              💾 Simpan Perubahan
            </button>
          )}
          <a href="/katalog" target="_blank" className="text-xs text-maroon py-1 text-center">
            👁 Lihat Katalog
          </a>
          <a href="/" target="_blank" className="text-xs text-maroon py-1 text-center">
            👁 Lihat Website
          </a>
          <button onClick={handleLogout} className="text-xs text-ink/50 hover:text-red-500 py-1">
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gold/20">
          <div className="font-display font-semibold text-sm">Admin Panel</div>
          <button onClick={handleLogout} className="text-xs text-maroon">Keluar</button>
        </div>
        <div className="md:hidden flex gap-2 overflow-x-auto p-3 bg-white border-b border-gold/20">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full ${tab === key ? "bg-maroon text-white" : "bg-cream2 text-ink/70"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto p-6">
          {tab === "hero" && (
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Hero Section</h3>
              <FieldText label="Judul Utama" value={content.hero.title} onChange={(v) => setContent({ ...content, hero: { ...content.hero, title: v } })} />
              <FieldTextarea label="Subjudul" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} />
              <FieldText label="Teks Tombol CTA" value={content.hero.cta} onChange={(v) => setContent({ ...content, hero: { ...content.hero, cta: v } })} />
              <FieldText label="URL Gambar Hero" value={content.hero.image} onChange={(v) => setContent({ ...content, hero: { ...content.hero, image: v } })} />
              <ImageUploadButton uploading={uploadingId === "hero"} onFile={(f) => handleHeroImageUpload(f)} label="📤 Upload gambar dari HP/PC" />
            </div>
          )}

          {tab === "brand" && (
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Identitas & Kontak</h3>
              <FieldText label="Nama Brand" value={content.brand.name} onChange={(v) => setContent({ ...content, brand: { ...content.brand, name: v } })} />
              <FieldText label="Tagline" value={content.brand.tagline} onChange={(v) => setContent({ ...content, brand: { ...content.brand, tagline: v } })} />
              <FieldText label="Nomor WhatsApp" value={content.brand.whatsapp} onChange={(v) => setContent({ ...content, brand: { ...content.brand, whatsapp: v } })} />
              <FieldText label="Instagram" value={content.brand.instagram} onChange={(v) => setContent({ ...content, brand: { ...content.brand, instagram: v } })} />
              <FieldTextarea label="Alamat" value={content.brand.address} onChange={(v) => setContent({ ...content, brand: { ...content.brand, address: v } })} />
              <FieldTextarea
                label="Lokasi untuk Google Maps (nama toko atau alamat lengkap)"
                value={content.brand.mapsQuery || content.brand.address}
                onChange={(v) => setContent({ ...content, brand: { ...content.brand, mapsQuery: v } })}
              />
              <p className="text-xs text-ink/50 -mt-3 mb-4">
                Isi dengan nama tempat di Google Maps (misal: &quot;Dapur Embun Manila&quot;) atau alamat lengkap. Peta di footer website akan otomatis mengikuti ini.
              </p>
            </div>
          )}

          {tab === "about" && (
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Tentang Kami</h3>
              <FieldTextarea label="Deskripsi" value={content.about} onChange={(v) => setContent({ ...content, about: v })} rows={5} />
            </div>
          )}

          {tab === "nav" && (
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">Menu Navigasi</h3>
              {content.nav.map((n, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={n}
                    onChange={(e) => {
                      const next = [...content.nav];
                      next[i] = e.target.value;
                      setContent({ ...content, nav: next });
                    }}
                    className="flex-1 border border-gold/30 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => setContent({ ...content, nav: content.nav.filter((_, idx) => idx !== i) })}
                    className="text-xs text-red-500 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={() => setContent({ ...content, nav: [...content.nav, "Menu Baru"] })} className="text-xs text-maroon mt-2 hover:underline">
                + Tambah menu
              </button>
            </div>
          )}

          {tab === "products" && (
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">Produk & Katalog</h3>
              <p className="text-xs text-ink/50 mb-4">Kategori dipakai untuk filter di halaman Katalog Kue. Ketik nama kategori bebas, misal: Cake, Cookies, Kukus.</p>
              {products.map((p, i) => (
                <div key={p.id} className="border border-gold/25 rounded-xl p-4 mb-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-maroon">Produk {i + 1}</span>
                    <button onClick={() => removeProduct(p.id)} className="text-xs text-red-500 hover:underline">
                      Hapus
                    </button>
                  </div>
                  <FieldText label="Nama Kue" value={p.name} onChange={(v) => updateProductLocal(p.id, "name", v)} />
                  <FieldTextarea label="Deskripsi" value={p.desc} onChange={(v) => updateProductLocal(p.id, "desc", v)} />
                  <FieldText label="Harga" value={p.price} onChange={(v) => updateProductLocal(p.id, "price", v)} />

                  <label className="block mb-4">
                    <span className="text-xs font-medium text-ink/60">Kategori</span>
                    <input
                      list={`cats-${p.id}`}
                      value={p.category}
                      onChange={(e) => updateProductLocal(p.id, "category", e.target.value)}
                      className="mt-1 w-full border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30"
                    />
                    <datalist id={`cats-${p.id}`}>
                      {usedCategories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </label>

                  <div className="mb-2">
                    <span className="text-xs font-medium text-ink/60">Foto Utama</span>
                  </div>
                  <FieldText label="URL Foto Utama" value={p.image} onChange={(v) => updateProductLocal(p.id, "image", v)} />
                  <ImageUploadButton uploading={uploadingId === p.id} onFile={(f) => handleImageUpload(f, p.id)} label="📤 Ganti foto utama" />

                  <div className="mt-4 mb-2">
                    <span className="text-xs font-medium text-ink/60">Galeri Foto Tambahan ({(p.images || []).length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(p.images || []).map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} className="w-16 h-16 object-cover rounded-lg border border-gold/30" alt="" />
                        <button
                          onClick={() => removeGalleryImage(p, idx)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <ImageUploadButton
                    uploading={uploadingId === p.id + "-gallery"}
                    onFile={(f) => handleGalleryUpload(f, p)}
                    label="📤 Tambah foto ke galeri"
                  />

                  <button
                    onClick={() => saveProduct(p)}
                    className="mt-3 w-full bg-maroon hover:bg-maroonDark text-white rounded-lg py-2 text-sm font-medium transition"
                  >
                    💾 Simpan Produk Ini
                  </button>
                </div>
              ))}
              <button
                onClick={addProduct}
                className="w-full py-2.5 rounded-lg border-2 border-dashed border-gold/50 text-sm text-ink/60 hover:border-maroon hover:text-maroon transition"
              >
                + Tambah Produk
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden p-4">
          {tab !== "products" && (
            <button onClick={saveContent} disabled={saving} className="w-full bg-maroon hover:bg-maroonDark text-white rounded-lg py-3 text-sm font-medium transition">
              💾 Simpan Perubahan
            </button>
          )}
          {status && <div className="text-xs text-center text-green-700 mt-2">{status}</div>}
        </div>
      </div>
    </div>
  );
}

function FieldText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block mb-4">
      <span className="text-xs font-medium text-ink/60">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30"
      />
    </label>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block mb-4">
      <span className="text-xs font-medium text-ink/60">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30"
      />
    </label>
  );
}

function ImageUploadButton({ uploading, onFile, label }: { uploading: boolean; onFile: (f: File) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-maroon border border-maroon rounded-full px-3 py-1.5 cursor-pointer hover:bg-maroon hover:text-white transition mb-4">
      {uploading ? "Mengunggah..." : label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </label>
  );
}
