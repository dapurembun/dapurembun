import { createClient } from "@/lib/supabase-server";
import { DEFAULT_CONTENT, type Product, type SiteContent } from "@/lib/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export const revalidate = 0;

async function getData() {
  const supabase = await createClient();

  const { data: contentRow } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "main")
    .maybeSingle();

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("position", { ascending: true });

  const content: SiteContent = (contentRow?.value as SiteContent) ?? DEFAULT_CONTENT;
  const products: Product[] = productsData ?? [];

  return { content, products };
}

export default async function HomePage() {
  const { content, products } = await getData();

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
