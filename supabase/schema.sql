-- =========================================================
-- Dapur Embun — Supabase Schema
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- =========================================================

-- 1. Tabel konten utama website (hero, brand, about, nav) disimpan sebagai JSON
create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- 2. Tabel produk best sellers
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  desc text not null,
  price text not null,
  image text not null,
  position int not null default 0,
  created_at timestamptz default now()
);

-- 3. Isi data awal (default) agar website langsung tampil saat pertama kali dibuka
insert into site_content (key, value)
values (
  'main',
  '{
    "brand": {
      "name": "Dapur Embun",
      "tagline": "Delicious and Halal Cake",
      "whatsapp": "08777 250 7783",
      "instagram": "@dapurembun",
      "address": "Samosir Viewers Road, Airport, Maharlika 4, Matanao, Manila"
    },
    "hero": {
      "title": "Cita Rasa Hangat, Kelezatan Halal",
      "subtitle": "Kue Premium Dapur Embun, Dijamin Halal & Menggugah Selera",
      "cta": "Pesan Sekarang",
      "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1400&auto=format&fit=crop"
    },
    "about": "Kue Premium Dapur Embun, menawarkan aneka kue dengan bahan pilihan, dibuat secara higienis, dengan cita rasa yang lezat dan pastinya HALAL. Cocok untuk berbagai momen spesial Anda.",
    "nav": ["Home", "Katalog Kue", "Tentang Kami", "Testimoni", "Kontak"]
  }'::jsonb
)
on conflict (key) do nothing;

insert into products (name, "desc", price, image, position) values
('Dapur Embun', 'Kue lapis dengan krim lembut dan stroberi segar', 'Rp 300', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop', 0),
('Crusted Kue Garonan', 'Kue karamel yang renyah di luar lembut di dalam', 'Rp 300', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=600&auto=format&fit=crop', 1),
('Crusted Kue Coklan', 'Perpaduan cokelat premium dan tekstur lembut', 'Rp 500', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop', 2),
('Dapur Embun Cokrom', 'Spesialitas kukus dengan cokelat lumer dan krim', 'Rp 500', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop', 3)
on conflict do nothing;

-- 4. Aktifkan Row Level Security
alter table site_content enable row level security;
alter table products enable row level security;

-- 5. Semua orang boleh MELIHAT (SELECT) konten & produk — untuk landing page publik
create policy "Public can read site_content" on site_content for select using (true);
create policy "Public can read products" on products for select using (true);

-- 6. Hanya user yang LOGIN (admin) yang boleh mengubah data
create policy "Authenticated can insert site_content" on site_content for insert to authenticated with check (true);
create policy "Authenticated can update site_content" on site_content for update to authenticated using (true);

create policy "Authenticated can insert products" on products for insert to authenticated with check (true);
create policy "Authenticated can update products" on products for update to authenticated using (true);
create policy "Authenticated can delete products" on products for delete to authenticated using (true);

-- =========================================================
-- 7. Storage bucket untuk upload gambar dari Admin Panel
-- Jalankan bagian ini juga di SQL Editor
-- =========================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public can view images" on storage.objects for select using (bucket_id = 'images');
create policy "Authenticated can upload images" on storage.objects for insert to authenticated with check (bucket_id = 'images');
create policy "Authenticated can update images" on storage.objects for update to authenticated using (bucket_id = 'images');
create policy "Authenticated can delete images" on storage.objects for delete to authenticated using (bucket_id = 'images');
