# E-Portfolio Arfido Ramadhani

E-portfolio praktik mengajar mandiri PPG Informatika, Universitas Muhammadiyah Surakarta. Situs statis dengan tampilan dark futuristic, lengkap dengan studio admin untuk mengelola seluruh konten.

## Isi portofolio

- **E-Portfolio 1 — Refleksi Awal**: tiga komponen, yaitu Profil Mahasiswa; Asal & Keunikan Daerah; serta Inspirasi, Tujuan & Visi, ditutup dengan kutipan.
- **E-Portfolio 2 — Rancangan Pembelajaran**: empat modul ajar siklus 1–4. Modul terbaik siklus 1 ditandai sebagai **Modul Terbaik**.
- **E-Portfolio 3 — Video Praktik**: empat kartu video dengan analisis momen penting, kekuatan, dan area perbaikan.
- **E-Portfolio 4 — Analisis & Refleksi**: refleksi tiap siklus, penilaian diri dalam bentuk bar kompetensi, dan timeline perkembangan.
- **Arsip Google Drive**: pencarian, filter kategori, dan tautan berkas langsung ke Google Drive.
- **Studio Admin**: CRUD modul, video, refleksi, dan arsip; edit profil; unggah foto; ganti passcode; export/import data; integrasi Google Drive.

## Menjalankan situs

### Cara cepat (Windows)

1. Klik dua kali `start.bat`.
2. Browser akan terbuka di `http://localhost:5500`.
3. Halaman admin: `http://localhost:5500/admin.html`.

`start.bat` membutuhkan Python. Jika belum ada, instal Python dari <https://www.python.org/downloads/> dan centang **Add python.exe to PATH** saat instalasi.

### Menjalankan manual

```bash
cd e-portfolio-arfido
python -m http.server 5500
```

Atau, jika memakai Node.js:

```bash
npx serve -l 5500
```

Buka `http://localhost:5500`. Jangan membuka `index.html` langsung dengan klik dua kali (`file://`), karena Google Drive OAuth memerlukan `http://` atau `https://`.

## Login admin

- Passcode bawaan: **`arfido2026`**
- Ganti passcode melalui **Pengaturan → Ganti Passcode**.
- Passcode disimpan sebagai hash di browser, bukan di server. Ini adalah proteksi lokal, bukan sistem keamanan tingkat produksi.
- Jika passcode lupa: buka DevTools browser, jalankan `localStorage.removeItem("eportfolio:arfido:v1")`, lalu muat ulang halaman admin. Tindakan ini juga menghapus seluruh konten yang belum diexport.

## Mengisi konten

1. Login ke `admin.html`.
2. Gunakan menu **Profil Mahasiswa** untuk mengubah nama, alamat, narasi, inspirasi, tujuan, visi, kutipan, dan foto profil.
3. Gunakan menu **Rancangan**, **Video Praktik**, **Refleksi**, dan **Arsip Drive** untuk menambah, mengubah, menduplikasi, atau menghapus item.
4. Tombol **Tambah** membuka editor. Setiap editor memiliki tombol simpan dan batal.
5. Foto dan berkas yang diunggah disimpan di IndexedDB browser. Ukuran maksimal 6 MB per berkas dan gambar otomatis dikompres.
6. Untuk video, tempel tautan YouTube (`https://youtu.be/...`) atau Google Drive (`https://drive.google.com/file/d/...`). Pemutar akan menyesuaikan format tautan secara otomatis.
7. Untuk modul dan arsip, tempel tautan Google Drive pada kolom yang tersedia. Pastikan berkas sudah dibagikan sebagai **Siapa saja yang memiliki link dapat melihat**.
8. Tandai satu modul sebagai **Modul Terbaik** lewat editor modul. Secara bawaan, modul siklus 1 sudah ditandai.

## Backup data

- **Pengaturan → Export Data (JSON)** mengunduh seluruh teks dan tautan.
- **Import Data** memulihkan data dari file JSON.
- **Backup ke Drive** mengunggah JSON ke folder Google Drive yang terhubung.
- Foto yang tersimpan lokal di IndexedDB **tidak** ikut dalam export JSON. Simpan foto asli secara terpisah, misalnya di Google Drive.
- **Reset ke Data Bawaan** mengembalikan seluruh konten contoh. Export terlebih dahulu jika diperlukan.

## Catatan penting tentang penyimpanan

Situs ini adalah situs statis tanpa server. Data yang Anda edit lewat admin tersimpan di **localStorage browser perangkat yang dipakai**. Artinya:

- Perubahan langsung terlihat di browser tersebut, termasuk saat membuka halaman publik.
- Pengunjung lain atau perangkat lain akan melihat konten bawaan, bukan perubahan lokal Anda.
- Untuk tugas presentasi, gunakan laptop/browser yang sama saat mengisi dan mempresentasikan portofolio.
- Jika ingin admin terpusat dan perubahan langsung tampil untuk semua pengunjung, diperlukan backend (misalnya Supabase atau Firebase). Arsitektur statis ini dipilih agar mudah dijalankan tanpa server.

Data tersimpan pada key `eportfolio:arfido:v1`; media pada database IndexedDB `eportfolio-media`.

## Google Drive

Integrasi Google Drive memungkinkan upload modul dan video langsung dari studio, membuat folder arsip, serta membagikan berkas otomatis. Ikuti langkah lengkap di [PANDUAN-GOOGLE-DRIVE.md](PANDUAN-GOOGLE-DRIVE.md).

Ringkasan:

1. Buat OAuth Client ID tipe **Web application** di Google Cloud Console.
2. Aktifkan **Google Drive API**.
3. Tambahkan origin `http://localhost:5500` (dan domain hosting) sebagai **Authorized JavaScript origin**.
4. Tempel Client ID di **Admin → Google Drive**, lalu klik **Hubungkan**.

Scope yang dipakai adalah `drive.file`, sehingga aplikasi hanya dapat mengakses berkas dan folder yang dibuat oleh aplikasi ini.

## Struktur proyek

```
e-portfolio-arfido/
├─ index.html                  Halaman publik
├─ admin.html                  Studio admin
├─ start.bat                   Server lokal + buka browser
├─ robots.txt                  Larangan indeks untuk halaman admin
├─ README.md
├─ PANDUAN-GOOGLE-DRIVE.md
└─ assets/
   ├─ css/
   │  ├─ style.css             Desain halaman publik
   │  └─ admin.css             Desain studio admin
   └─ js/
      ├─ store.js              Data bawaan, localStorage, helper
      ├─ app.js                Render halaman publik, modal, filter
      ├─ admin.js              Autentikasi, CRUD, editor, backup
      ├─ media.js              IndexedDB, kompresi gambar
      └─ drive.js              OAuth Google + Drive REST v3
```

## Publikasi (opsional)

Folder ini dapat diunggah ke Netlify, Vercel, GitHub Pages, atau hosting kampus.

1. Unggah seluruh isi folder.
2. Daftarkan domain hasil hosting sebagai **Authorized JavaScript origin** di OAuth Client ID.
3. Buka situs melalui HTTPS.

Ingat: fitur admin tetap berjalan lokal di browser pengunjung. Untuk portofolio yang dibagikan, isi konten bawaan di `assets/js/store.js` atau gunakan backend jika konten harus dapat diubah dari mana saja.

## Konten yang masih perlu diganti

- Alamat email masih memakai placeholder `arfidoramadhani@gmail.com`. Ganti di **Profil Mahasiswa** jika berbeda.
- Nama sekolah, kelas, dan detail pelaksanaan belum diisi karena belum diberikan.
- Tautan video praktik dan modul Google Drive sengaja dikosongkan. Kartu akan menampilkan empty state yang rapi sampai tautan ditambahkan.
- Isi modul dan analisis merupakan draf substansial berbasis identitas yang diberikan. Sesuaikan dengan dokumen dan rekaman asli sebelum dikumpulkan.
