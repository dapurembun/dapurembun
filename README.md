# Dapur Embun — Website + Admin Panel

Website landing page **Dapur Embun** dibangun dengan **Next.js 15 + Tailwind CSS + Supabase**,
lengkap dengan admin panel untuk mengelola semua konten (hero, produk, tentang kami, kontak, menu navigasi)
tanpa perlu sentuh kode.

## 🧱 Struktur Proyek
```
app/
  page.tsx              -> Landing page publik
  admin/login/           -> Halaman login admin
  admin/dashboard/       -> Panel admin (CRUD konten & produk)
components/               -> Header, Hero, BestSellers, About, Footer
lib/                       -> Koneksi Supabase & tipe data
supabase/schema.sql        -> Skema database siap pakai
middleware.ts               -> Proteksi otomatis /admin/dashboard
```

## 🚀 Langkah Setup (± 15 menit)

### 1. Buat project Supabase
1. Buka https://supabase.com → **New Project**
2. Setelah project jadi, buka **SQL Editor** → tempel isi file `supabase/schema.sql` → **Run**
   (ini akan membuat tabel `site_content`, `products`, storage bucket `images`, dan data awal)

### 2. Buat akun admin
1. Di Supabase Dashboard → **Authentication → Users → Add user**
2. Isi email & password (misal: `admin@dapurembun.com`) → **Auto Confirm User** dicentang
3. Ini email/password yang dipakai untuk login ke `/admin/login`

### 3. Ambil API keys
1. Di Supabase Dashboard → **Project Settings → API**
2. Salin `Project URL` dan `anon public key`

### 4. Setup environment variables
1. Duplikat file `.env.local.example` menjadi `.env.local`
2. Isi dengan URL & anon key dari langkah 3:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-key-disini
```

### 5. Jalankan secara lokal
```bash
npm install
npm run dev
```
Buka http://localhost:3000 untuk website, dan http://localhost:3000/admin/login untuk admin panel.

### 6. Deploy ke Vercel
1. Push folder ini ke GitHub
2. Import project di https://vercel.com/new
3. Tambahkan environment variables yang sama (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) di Vercel Project Settings → Environment Variables
4. Deploy 🎉

## ✏️ Cara pakai Admin Panel
- Login di `/admin/login` pakai email & password yang dibuat di Supabase
- Menu di sidebar kiri:
  - **Hero** — judul, subjudul, tombol CTA, gambar hero (bisa upload langsung dari HP)
  - **Identitas & Kontak** — nama brand, tagline, WhatsApp, Instagram, alamat
  - **Produk** — tambah/edit/hapus produk best seller, harga, gambar (upload langsung)
  - **Tentang Kami** — deskripsi
  - **Navigasi** — menu di header
- Klik **💾 Simpan Perubahan** (atau **Simpan Produk Ini** untuk produk) → perubahan langsung tampil di website publik
- Klik **👁 Lihat Website** untuk cek hasilnya di tab baru

## 🎨 Palet Warna
| Nama | Hex |
|---|---|
| Cream (background) | `#FBF3E7` |
| Cream 2 | `#F3E6D3` |
| Maroon (aksen utama) | `#8C2A2A` |
| Gold (aksen garis/detail) | `#C79A4B` |
| Ink (teks) | `#3A2B22` |

Font: **Playfair Display** (judul) + **Inter** (body).

## 🔒 Keamanan
- Semua orang bisa **melihat** website & produk (read-only)
- Hanya user yang **login** yang bisa **mengubah** data (lewat Supabase Auth + Row Level Security)
- Rute `/admin/dashboard` otomatis redirect ke `/admin/login` kalau belum login

## 🧩 Kembangkan Lebih Lanjut
Ide penambahan fitur ke depan:
- Halaman "Katalog Kue" penuh (bukan cuma 4 best sellers)
- Form testimoni pelanggan + admin approval
- Integrasi pembayaran (Midtrans/Xendit) untuk checkout langsung
- Multi-admin dengan role (owner, staff)
