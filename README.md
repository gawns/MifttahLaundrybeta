# duar — Miftah Laundry

Landing page layanan laundry Miftah (HTML, CSS, JavaScript) beserta server statis Python.

Live: https://miftahlaundry.vercel.app

## Halaman

- `index.html` — beranda: hero, tentang, layanan, keunggulan, galeri, dan kontak.

## Fitur

- Tema terang/gelap (disimpan di `localStorage`).
- Navigasi dengan indikator tautan aktif dan menu hamburger (mobile).
- Formulir pesanan dengan estimasi harga berbasis slider (berat/jumlah).
- Pengiriman formulir kontak melalui API Fonnte (WhatsApp).
- Galeri dengan lightbox dan pemuatan gambar bertahap (lazy load).
- Server statis `server.py` (port 8000) dengan opsi ekspos melalui ngrok.

## Struktur

- `index.html` — markup halaman.
- `style.css` — tata letak dan tema.
- `script.js` — interaksi halaman.
- `server.py` — server statis Python.
- `images/` — aset gambar.

## Menjalankan

```bash
python server.py       # http://localhost:8000
```

## Catatan

Versi situs ini juga ada pada repositori `miftyahhlaund-Project`.
