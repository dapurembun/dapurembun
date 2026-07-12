"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { DEFAULT_CONTENT, type Product, type SiteContent } from "@/lib/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      const { data: contentRow } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "main")
        .maybeSingle();

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("position", { ascending: true });

      if (contentRow?.value) setContent(contentRow.value as SiteContent);
      if (productsData) setProducts(productsData as Product[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-sm text-ink/50">Memuat...</p>
      </main>
    );
  }

  return (
    <main>
      <Header content={content} />
      <Hero content={content} />
      <BestSellers products={products} />
      <About content={content} />
      <Testimonials />
      <Footer content={content} />
    </main>
  );
}
