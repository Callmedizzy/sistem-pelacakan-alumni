# Sistem Pelacakan Alumni

Aplikasi web sederhana untuk mengelola data dan pelacakan alumni.

## Teknologi yang Digunakan

- HTML
- CSS
- JavaScript
- Node.js
- Express
- JSON file sebagai database

## Cara Menjalankan Aplikasi Secara Lokal

1. Install Node.js.
2. Jalankan perintah berikut di folder project:

```bash
npm install
npm run import:alumni
npm start
```

3. Buka browser di:

```
http://localhost:3000
```

## Fitur Aplikasi

- Login admin untuk mengakses data
- Import data alumni dari Excel
- Tambah data alumni
- Cari data alumni
- Edit data alumni
- Hapus data alumni
- Menampilkan statistik status pelacakan

## Tabel Pengujian Aplikasi

| No | Fitur         | Skenario Pengujian                     | Hasil    |
| -- | ------------- | -------------------------------------- | -------- |
| 1  | Login Admin   | Admin login dengan kredensial benar    | Berhasil |
| 2  | Lihat Data    | Admin melihat data alumni setelah login| Berhasil |
| 3  | Tambah Alumni | Menambahkan data alumni baru           | Berhasil |
| 4  | Cari Alumni   | Mencari alumni berdasarkan nama        | Berhasil |
| 5  | Edit Alumni   | Memperbarui data alumni                | Berhasil |
| 6  | Hapus Alumni  | Menghapus data alumni                  | Berhasil |

## Login Admin

Gunakan kredensial berikut untuk login:

- Username: `admin`
- Password: `Alumni@2026`

Untuk mengganti kredensial, set environment variable:

- `ALUMNI_ADMIN_USER`
- `ALUMNI_ADMIN_PASS`

## Catatan Keamanan

Semua data hanya digunakan untuk kepentingan pembelajaran dan dilarang disebarluaskan untuk kepentingan apa pun.
