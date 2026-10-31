# Panduan Google Drive

Panduan ini menjelaskan cara menghubungkan studio admin ke Google Drive, membuat folder arsip, mengunggah berkas, dan menempelkan tautan berkas yang sudah ada.

## Yang dibutuhkan

- Akun Google.
- Situs dijalankan lewat `http://localhost:5500` (klik `start.bat`) atau melalui hosting HTTPS.
- Akses ke [Google Cloud Console](https://console.cloud.google.com/).
- Waktu sekitar 10–15 menit untuk pengaturan pertama kali.

> Integrasi memakai OAuth resmi Google dengan scope `drive.file`. Aplikasi hanya dapat melihat dan mengelola berkas/folder yang dibuatnya sendiri. Aplikasi tidak dapat membaca seluruh isi Drive Anda.

## 1. Buat project Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Klik pemilih project di bagian atas, lalu **New Project**.
3. Beri nama, misalnya `E-Portfolio Arfido`, lalu klik **Create**.
4. Pastikan project tersebut sedang aktif.

## 2. Aktifkan Google Drive API

1. Buka **APIs & Services → Library**.
2. Cari **Google Drive API**.
3. Klik **Enable**.

## 3. Atur OAuth consent screen

1. Buka **APIs & Services → OAuth consent screen**.
2. Pilih **External** jika akun Anda adalah akun Gmail biasa, lalu **Create**.
3. Isi:
   - **App name**: `E-Portfolio Arfido`
   - **User support email**: email Anda
   - **Developer contact information**: email Anda
4. Simpan dan lanjutkan.
5. Pada bagian **Scopes**, tambahkan:
   - `https://www.googleapis.com/auth/drive.file`
6. Pada bagian **Test users**, tambahkan akun Google yang akan dipakai mengunggah berkas.
7. Simpan.

Selama application masih berstatus **Testing**, hanya akun yang terdaftar sebagai test user yang dapat memberikan izin. Untuk pemakaian pribadi, ini sudah cukup dan tidak perlu verifikasi aplikasi.

## 4. Buat OAuth Client ID

1. Buka **APIs & Services → Credentials**.
2. Klik **Create Credentials → OAuth client ID**.
3. Pilih **Application type: Web application**.
4. Isi nama, misalnya `E-Portfolio Web`.
5. Pada **Authorized JavaScript origins**, tambahkan:
   - `http://localhost:5500`
   - `http://127.0.0.1:5500`
   - domain hosting Anda nanti, misalnya `https://arfido.netlify.app`
6. Jangan perlu mengisi **Authorized redirect URIs** untuk alur ini.
7. Klik **Create**.
8. Salin **Client ID** yang berakhiran `.apps.googleusercontent.com`.

> Jika port server berbeda, sesuaikan origin-nya. Origin harus sama persis: protokol, domain, dan port. Tidak boleh memakai garis miring di akhir.

## 5. Hubungkan dari studio admin

1. Buka `http://localhost:5500/admin.html`.
2. Login dengan passcode admin.
3. Buka menu **Google Drive**.
4. Tempel **OAuth Client ID** pada kolom yang tersedia. Perubahan tersimpan otomatis.
5. Klik **Hubungkan**. Jendela izin Google akan terbuka.
6. Pilih akun Google, lalu setujui akses.
7. Setelah kembali ke studio, status akan berubah menjadi **Terhubung (sesi aktif)**.
8. Klik **Buat / Temukan Folder**. Folder default bernama `E-Portfolio Arfido` akan dibuat, atau folder yang sudah ada akan dipakai kembali.
9. Klik **Uji Koneksi** untuk memastikan izin berjalan.
10. Gunakan area **Uji Unggah** untuk mencoba mengunggah satu berkas kecil.

Folder ID akan tersimpan otomatis. Jika Anda sudah memiliki folder sendiri, tempel ID folder tersebut di kolom **Folder ID**. Pastikan folder itu dibuat atau diakses melalui aplikasi yang sama agar sesuai dengan scope `drive.file`.

## 6. Mengunggah modul atau video

### Dari editor konten

1. Buka **Rancangan**, **Video Praktik**, atau **Arsip Drive**.
2. Klik **Tambah** atau ikon edit pada item.
3. Pada kolom tautan Google Drive, klik **Unggah**.
4. Pilih berkas. Berkas akan diunggah ke folder aktif.
5. Tautan akan terisi otomatis setelah unggah selesai.
6. Simpan item.

Jika opsi **Bagikan berkas secara publik** dicentang di pengaturan Drive, berkas akan otomatis diberi izin **siapa saja yang memiliki link dapat melihat**. Jika tidak dicentang, berkas hanya dapat dibuka oleh akun yang memiliki akses.

### Dari panel Google Drive

Area **Uji Unggah** dapat dipakai untuk mengunggah berkas tanpa melalui editor. Hasil unggahan menampilkan tautan yang bisa disalin.

## 7. Menempelkan berkas yang sudah ada di Drive

Jika modul sudah diunggah manual ke Drive:

1. Buka file di Google Drive.
2. Klik **Share** / **Bagikan**.
3. Ubah akses menjadi **Anyone with the link** → **Viewer**.
4. Klik **Copy link**.
5. Di studio admin, buka editor item terkait.
6. Tempel tautan pada kolom **Tautan Modul di Google Drive** atau **Tautan Google Drive**.
7. Simpan.

Format tautan yang dikenali:

- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/drive/folders/FOLDER_ID`
- `https://docs.google.com/document/d/DOC_ID/...`
- `https://docs.google.com/presentation/d/...`
- `https://docs.google.com/spreadsheets/d/...`

Untuk video Drive, aplikasi mengubah tautan file menjadi pemutar `/preview` secara otomatis. Video harus dibagikan agar dapat diputar oleh pengunjung.

## 8. Masalah umum

### “Client ID Google belum diisi atau formatnya belum benar”

Pastikan Client ID disalin lengkap dan berakhiran `.apps.googleusercontent.com`. Jangan memakai Client Secret.

### “Gagal terhubung. Pastikan origin situs terdaftar”

Tambahkan origin yang sedang dipakai ke **Authorized JavaScript origins**, termasuk port. Contoh yang benar:

```text
http://localhost:5500
```

Contoh yang salah:

```text
http://localhost:5500/
localhost:5500
```

Jika situs dibuka lewat `127.0.0.1`, tambahkan juga `http://127.0.0.1:5500`.

### “Access blocked” atau “app not verified”

Application masih dalam mode Testing. Tambahkan akun Google Anda sebagai **Test user** di OAuth consent screen. Anda juga dapat mengklik **Advanced → Go to ... (unsafe)** pada layar izin untuk aplikasi milik sendiri.

### Popup izin tidak muncul

Izinkan popup untuk `localhost:5500` di browser, lalu klik **Hubungkan** lagi. Jika sebelumnya pernah menolak, buka pengaturan situs di browser dan hapus blokir popup.

### “Google Drive API has not been used in project...”

Aktifkan **Google Drive API** pada project yang sama dengan Client ID.

### “Sesi Google Drive berakhir”

Token akses hanya berlaku sekitar satu jam dan tidak disimpan permanen. Klik **Hubungkan** lagi. Ulangi upload jika diperlukan.

### Unggah berhasil tetapi berkas tidak bisa dibuka pengunjung

Berkas belum dibagikan. Buka file di Drive → **Share** → **Anyone with the link** → **Viewer**. Atau centang opsi pembagian publik di panel Drive sebelum mengunggah.

### Folder tidak ditemukan

Jika Folder ID diisi manual, pastikan folder tersebut dibuat oleh aplikasi yang sama atau dapat diakses dengan scope `drive.file`. Cara paling aman: kosongkan Folder ID, lalu klik **Buat / Temukan Folder**.

## 9. Keamanan

- Client ID bukan rahasia; aman disimpan di pengaturan situs.
- Jangan pernah menempel Client Secret ke dalam kode frontend. Integrasi ini tidak memerlukannya.
- Token akses hanya disimpan di memori browser dan tidak ditulis ke localStorage.
- Passcode admin adalah proteksi lokal, bukan pengganti autentikasi server. Siapa pun yang menguasai perangkat dan DevTools dapat membaca data localStorage.
- Jika situs dipublikasikan, pertimbangkan untuk tidak menyertakan halaman admin atau lindungi dengan autentikasi tambahan.

## 10. Setelah situs dihosting

1. Daftarkan domain hosting sebagai **Authorized JavaScript origin**.
2. Tunggu beberapa menit agar perubahan Google Cloud berlaku.
3. Buka situs melalui HTTPS.
4. Hubungkan ulang Google Drive dari perangkat yang akan dipakai mengunggah.

Google Identity Services memerlukan HTTPS untuk domain publik. `localhost` dikecualikan dan tetap dapat memakai HTTP.
