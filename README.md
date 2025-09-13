# Dokter App Server

## Setup

1. Copy file `.env.example` menjadi `.env` dan isi dengan konfigurasi PostgreSQL Anda.
2. Install dependencies:
   ```
   npm install express pg dotenv
   ```
3. Jalankan server:
   ```
   node index.js
   ```

## Struktur Awal
- `index.js` : Entry point server
- `db.js` : Koneksi PostgreSQL
- `routes/user.js` : Endpoint user (akan dikembangkan)

## Endpoint Awal
- `GET /api/users` : Cek endpoint user

Siap dikembangkan untuk fitur pasien & dokter selanjutnya.
