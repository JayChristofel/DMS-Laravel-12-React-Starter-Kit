# DMS-Laravel-12-React-Starter-Kit

Aplikasi Sistem Manajemen Dokumen berbasis web yang dibuat menggunakan Laravel React Starter Kit. Aplikasi ini memungkinkan pengguna untuk mengelola dokumen dengan fitur versioning, penandaan (tagging), dan pengelolaan masa berlaku dokumen.

## Fitur Utama

### Manajemen Dokumen
- Upload berbagai jenis dokumen (PDF, Word, Excel, PowerPoint)
- Versi dokumen untuk melacak perubahan
- Tag untuk kategorisasi dokumen
- Masa berlaku dokumen dengan notifikasi kadaluarsa
- Preview dokumen langsung dalam aplikasi
- Download dokumen

### Manajemen Pengguna
- Peran pengguna (admin & user)
- Admin dapat membuat, mengedit, dan menghapus pengguna
- Status pengguna (aktif/tidak aktif)
- Autentikasi dan otorisasi berbasis peran

## Teknologi yang Digunakan

### Backend
- Laravel
- MySQL
- PHP

### Frontend
- React
- TypeScript
- Inertia.js
- Tailwind CSS
- shadcn/ui components

## Persyaratan Sistem

- PHP 8.1 atau lebih tinggi
- Node.js 16 atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- Composer
- NPM atau Yarn

## Instalasi

### Langkah-langkah Instalasi

1. Clone repositori ini
   ```bash
   git clone [link-repositori]
   cd [nama-folder]
   ```

2. Instal dependensi PHP
   ```bash
   composer install
   ```

3. Instal dependensi JavaScript
   ```bash
   npm install
   ```

4. Salin file .env.example menjadi .env
   ```bash
   cp .env.example .env
   ```

5. Buat kunci aplikasi
   ```bash
   php artisan key:generate
   ```

6. Konfigurasi database di file .env

7. Jalankan migrasi database
   ```bash
   php artisan migrate --seed
   ```

8. Link storage
   ```bash
   php artisan storage:link
   ```

9. Build assets
   ```bash
   npm run build
   ```

10. Jalankan aplikasi
    ```bash
    php artisan serve
    ```

11. Buka aplikasi di browser: http://localhost:8000

## Penggunaan

### Login Admin
- Email: admin@example.com
- Password: password

### Login User
- Email: user@example.com
- Password: password

## Struktur Proyek

- `app/` - Kode backend Laravel
- `resources/js/` - Kode frontend React/TypeScript
- `resources/js/pages/` - Halaman-halaman aplikasi
- `resources/js/components/` - Komponen UI yang dapat digunakan kembali
- `database/migrations/` - Migrasi basis data

## Fitur Tampilan

### Halaman Admin
- Dashboard statistik
- Manajemen pengguna
- Manajemen dokumen

### Halaman User
- Daftar dokumen yang tersedia
- Detail dan preview dokumen

## Lisensi

[Sesuaikan dengan lisensi yang Anda gunakan]

## Kontak

[Informasi kontak pengembang] 
