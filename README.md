# WTProject1 - Test Backend API

Backend API untuk aplikasi Flutter yang menyediakan fitur **autentikasi pengguna**, **manajemen data pengguna**, dan **upload foto profil**.

Dibuat menggunakan **Express.js** dengan database **MySQL**.

---

## Daftar Isi

1. [Apa Itu Project Ini?](#apa-itu-project-ini)
2. [Persiapan Sebelum Memulai](#persiapan-sebelum-memulai)
3. [Cara Instalasi](#cara-instalasi)
4. [Struktur Folder](#struktur-folder)
5. [Cara Menjalankan Server](#cara-menjalankan-server)
6. [Daftar Semua API](#daftar-semua-api)
7. [Cara Test API](#cara-test-api-menggunakan-postman)
8. [Penjelasan Pesan Error](#penjelasan-pesan-error)

---

## Apa Itu Project Ini?

Project ini adalah **server backend** (bagian belakang layar) yang bertugas:

- **Menerima dan memproses data** dari aplikasi Flutter (atau aplikasi lainnya)
- **Menyimpan data pengguna** ke database MySQL (seperti nama, email, password)
- **Mengamankan akses** menggunakan sistem login dengan token (JWT)
- **Mengatur hak akses** berdasarkan peran (admin atau user biasa)
- **Mengelola upload foto** profil pengguna

Bayangkan server ini seperti **resepsionis di hotel** — dia menerima permintaan tamu, memverifikasi identitas, lalu memberikan layanan yang sesuai.

---

## Persiapan Sebelum Memulai

Sebelum menjalankan project ini, pastikan komputer Anda sudah memiliki software berikut:

### 1. Node.js (Wajib)

Node.js adalah program yang menjalankan kode JavaScript di komputer Anda.

- Download di: [https://nodejs.org](https://nodejs.org)
- Pilih versi **LTS** (Long Term Support)
- Ikuti proses instalasi seperti biasa (klik Next sampai selesai)
- Untuk mengecek apakah sudah terinstall, buka **Command Prompt** (ketik `cmd` di pencarian Windows), lalu ketik:
  ```
  node --version
  ```
  Jika muncul angka versi (contoh: `v20.x.x`), berarti sudah berhasil.

### 2. MySQL (Wajib)

MySQL adalah tempat penyimpanan data (database).

- Cara termudah: Install **Laragon** / **XAMPP** yang sudah termasuk MySQL
- Download di: [https://laragon.org/download](https://laragon.org/download)
- Setelah install, buka Laragon dan klik **Start All** pada **MySQL**
- Download di: [https://www.apachefriends.org](https://www.apachefriends.org)
- Setelah install, buka XAMPP Control Panel dan klik **Start** pada **MySQL**

### 3. Postman (Untuk Testing)

Postman adalah alat untuk mencoba/menguji API tanpa perlu membuat aplikasi.

- Download di: [https://www.postman.com/downloads](https://www.postman.com/downloads)
- Install seperti biasa

### 4. Git (Opsional)

Untuk mengunduh kode dari repository.

- Download di: [https://git-scm.com](https://git-scm.com)

---

## Cara Instalasi

### Langkah 1: Buka Command Prompt

Buka folder project ini di Command Prompt. Caranya:
- Buka File Explorer, navigasi ke folder project ini
- Klik pada address bar (bagian atas yang menunjukkan lokasi folder)
- Ketik `cmd` lalu tekan Enter

### Langkah 2: Install Dependencies (Paket yang Dibutuhkan)

Ketik perintah berikut di Command Prompt:

```bash
npm install
```

Tunggu sampai proses selesai. Perintah ini akan mendownload semua paket/library yang dibutuhkan project ini.

### Langkah 3: Siapkan Database

1. Pastikan MySQL pada Laragon sudah berjalan (jika pakai XAMPP, klik Start pada MySQL)
2. Buka **phpMyAdmin** di browser: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Klik tab **SQL** di bagian atas
4. Copy-paste perintah berikut lalu klik **Go/Jalankan**:

```sql
CREATE DATABASE IF NOT EXISTS wtproject1_db;

USE wtproject1_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  photo VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Langkah 4: Konfigurasi File `.env`

Buat file bernama `.env` di folder utama project (jika belum ada), lalu isi dengan:

```env
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=wtproject1_db
DB_PORT=3306
JWT_SECRET=rahasia_token_anda_ganti_ini
JWT_EXPIRES_IN=7d
PORT=3000
```

> **Catatan:** Jika MySQL Anda memiliki password, isi `DB_PASSWORD` dengan password tersebut. Jika menggunakan Laragon/XAMPP default, biarkan kosong.

---

## Struktur Folder

```
wtproject1_be/
├── index.js                 ← File utama yang menjalankan server
├── package.json             ← Daftar paket/library yang digunakan
├── .env                     ← Pengaturan (database, secret key, port)
├── config/
│   └── database.js          ← Pengaturan koneksi ke database MySQL
├── middleware/
│   ├── auth.js              ← Pengecekan token login (siapa yang mengakses?)
│   └── role.js              ← Pengecekan peran/jabatan (admin atau user?)
├── models/
│   └── userModel.js         ← Perintah-perintah ke database (simpan, ambil, hapus data)
├── controllers/
│   ├── authController.js    ← Logika untuk daftar akun & login
│   └── userController.js    ← Logika untuk kelola data user & upload foto
├── routes/
│   ├── authRoutes.js        ← Daftar alamat URL untuk autentikasi
│   └── userRoutes.js        ← Daftar alamat URL untuk kelola user
├── migrations/
│   └── 001_create_users.sql ← Perintah SQL untuk membuat tabel di database
└── uploads/                 ← Tempat penyimpanan foto yang diupload
```

---

## Cara Menjalankan Server

1. Buka Command Prompt di folder project
2. Ketik:

```bash
node index.js
```

3. Jika berhasil, akan muncul pesan:
   ```
   Server berjalan di port 3000
   ```

4. Server sekarang siap menerima permintaan di alamat: `http://localhost:3000`

> **Untuk menghentikan server:** Tekan `Ctrl + C` di Command Prompt.

---

## Daftar Semua API

API (Application Programming Interface) adalah "pintu masuk" yang bisa diakses oleh aplikasi untuk mengirim atau mengambil data. Berikut semua API yang tersedia:

### Ringkasan Cepat

| No | Metode | Alamat URL | Fungsi | Perlu Login? | Khusus Admin? |
|----|--------|-----------|--------|:------------:|:-------------:|
| 1 | POST | `/api/auth/register` | Daftar akun baru | Tidak | Tidak |
| 2 | POST | `/api/auth/login` | Login/masuk | Tidak | Tidak |
| 3 | GET | `/api/users/profile` | Lihat profil sendiri | Ya | Tidak |
| 4 | GET | `/api/users` | Lihat semua user | Ya | Ya |
| 5 | GET | `/api/users/:id` | Lihat user tertentu | Ya | Tidak |
| 6 | PUT | `/api/users/:id` | Edit data user | Ya | Tidak* |
| 7 | DELETE | `/api/users/:id` | Hapus user | Ya | Ya |
| 8 | PUT | `/api/users/:id/photo` | Upload foto profil | Ya | Tidak* |

> \* User biasa hanya bisa mengedit/upload foto untuk akun miliknya sendiri. Admin bisa untuk semua akun.

---

## Cara Test API Menggunakan Postman

Berikut panduan langkah demi langkah untuk mencoba setiap API menggunakan Postman.

### Persiapan Awal

1. Buka aplikasi **Postman**
2. Pastikan server sudah berjalan (`node index.js`)
3. Semua URL dimulai dengan `http://localhost:3000`

---

### TEST 1: Daftar Akun Baru (Register)

Ini untuk membuat akun pengguna baru.

**Langkah-langkah:**

1. Di Postman, klik tombol **+** untuk membuat request baru
2. Ubah metode dari **GET** menjadi **POST** (klik dropdown di sebelah kiri URL)
3. Ketik URL: `http://localhost:3000/api/auth/register`
4. Klik tab **Body** (di bawah URL)
5. Pilih **raw**
6. Ubah dropdown di sebelah kanan dari **Text** menjadi **JSON**
7. Ketik data berikut di area teks:

```json
{
  "name": "M Fathan R",
  "email": "fathan@example.com",
  "password": "123456"
}
```

8. Klik tombol **Send** (tombol biru di kanan)

**Hasil yang diharapkan (Status: 201 Created):**

```json
{
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "name": "M Fathan R",
    "email": "fathan@example.com",
    "role": "user"
  }
}
```

**Kemungkinan Error:**
- `"Semua field wajib diisi"` → Pastikan name, email, dan password semua terisi
- `"Email sudah terdaftar"` → Email tersebut sudah dipakai, gunakan email lain

---

### TEST 2: Login

Ini untuk masuk ke akun dan mendapatkan **token** (kunci akses).

**Langkah-langkah:**

1. Buat request baru, metode **POST**
2. URL: `http://localhost:3000/api/auth/login`
3. Tab **Body** → **raw** → **JSON**
4. Ketik:

```json
{
  "email": "fathan@example.com",
  "password": "123456"
}
```

5. Klik **Send**

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...(teks panjang)...",
    "user": {
      "id": 1,
      "name": "M Fathan R",
      "email": "fathan@example.com",
      "role": "user",
      "photo": null
    }
  }
}
```

> **PENTING:** Copy nilai `token` tersebut (teks panjang yang dimulai dengan `eyJ...`). Token ini akan digunakan untuk semua request berikutnya sebagai bukti bahwa Anda sudah login.

**Kemungkinan Error:**
- `"Email dan password wajib diisi"` → Pastikan kedua field terisi
- `"Email atau password salah"` → Periksa kembali email dan password

---

### Cara Menggunakan Token (Untuk Semua Request yang Perlu Login)

Setelah login dan mendapatkan token, setiap kali Anda mengakses API yang membutuhkan login, Anda perlu menyertakan token tersebut. Caranya:

1. Klik tab **Authorization** (di bawah URL)
2. Pada dropdown **Type**, pilih **Bearer Token**
3. Paste token yang sudah di-copy tadi ke kolom **Token**

> Ini seperti menunjukkan kartu identitas setiap kali Anda mau masuk ke ruangan tertentu.

---

### TEST 3: Lihat Profil Sendiri

Melihat data profil akun yang sedang login.

**Langkah-langkah:**

1. Buat request baru, metode **GET**
2. URL: `http://localhost:3000/api/users/profile`
3. Pasang token di tab **Authorization** → **Bearer Token** (lihat panduan di atas)
4. Klik **Send**

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "Berhasil",
  "data": {
    "id": 1,
    "name": "M Fathan R",
    "email": "fathan@example.com",
    "role": "user",
    "photo": null,
    "created_at": "2026-02-14T10:00:00.000Z",
    "updated_at": "2026-02-14T10:00:00.000Z"
  }
}
```

**Kemungkinan Error:**
- `"Token tidak ditemukan"` → Pastikan token sudah dipasang di tab Authorization
- `"Token tidak valid"` → Token salah atau sudah kadaluarsa, login ulang untuk mendapatkan token baru

---

### TEST 4: Lihat Semua User (Khusus Admin)

Menampilkan daftar seluruh pengguna yang terdaftar. **Hanya bisa diakses oleh admin.**

**Langkah-langkah:**

1. Buat request baru, metode **GET**
2. URL: `http://localhost:3000/api/users`
3. Pasang token **admin** di tab Authorization
4. Klik **Send**

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "Berhasil",
  "data": [
    {
      "id": 1,
      "name": "M Fathan R",
      "email": "fathan@example.com",
      "role": "user",
      "photo": null,
      "created_at": "2026-02-14T10:00:00.000Z",
      "updated_at": "2026-02-14T10:00:00.000Z"
    }
  ]
}
```

**Kemungkinan Error:**
- `"Akses ditolak"` → Anda login sebagai user biasa, bukan admin

> **Cara membuat akun admin:** Ubah role user langsung di database melalui phpMyAdmin. Buka tabel `users`, klik Edit pada user yang diinginkan, ubah kolom `role` dari `user` menjadi `admin`, lalu klik Go.

---

### TEST 5: Lihat User Berdasarkan ID

Melihat data satu pengguna tertentu berdasarkan nomor ID-nya.

**Langkah-langkah:**

1. Buat request baru, metode **GET**
2. URL: `http://localhost:3000/api/users/1` (ganti `1` dengan ID user yang ingin dilihat)
3. Pasang token di tab Authorization
4. Klik **Send**

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "Berhasil",
  "data": {
    "id": 1,
    "name": "M Fathan R",
    "email": "fathan@example.com",
    "role": "user",
    "photo": null,
    "created_at": "2026-02-14T10:00:00.000Z",
    "updated_at": "2026-02-14T10:00:00.000Z"
  }
}
```

**Kemungkinan Error:**
- `"User tidak ditemukan"` → Tidak ada user dengan ID tersebut

---

### TEST 6: Edit Data User

Mengubah data pengguna (nama, email, password, atau role).

**Aturan penting:**
- **User biasa** hanya bisa mengedit akun **miliknya sendiri** dan **tidak bisa** mengubah role
- **Admin** bisa mengedit akun **siapa saja** dan bisa mengubah role

**Langkah-langkah:**

1. Buat request baru, metode **PUT**
2. URL: `http://localhost:3000/api/users/1` (ganti `1` dengan ID user yang ingin diedit)
3. Pasang token di tab Authorization
4. Tab **Body** → **raw** → **JSON**
5. Ketik data yang ingin diubah (tidak perlu semua, cukup yang ingin diubah saja):

```json
{
  "name": "Fathan Updated",
  "email": "fathan.updated@example.com"
}
```

6. Klik **Send**

**Contoh lain — Admin mengubah role user:**

```json
{
  "role": "admin"
}
```

**Contoh lain — Mengubah password:**

```json
{
  "password": "456789"
}
```

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "User berhasil diupdate",
  "data": {
    "id": 1,
    "name": "M Fathan R",
    "email": "fathan.updated@example.com",
    "role": "user",
    "photo": null,
    "created_at": "2026-02-14T10:00:00.000Z",
    "updated_at": "2026-02-14T10:30:00.000Z"
  }
}
```

**Kemungkinan Error:**
- `"Akses ditolak"` → User biasa mencoba mengedit akun orang lain, atau mencoba mengubah role

---

### TEST 7: Hapus User (Khusus Admin)

Menghapus akun pengguna secara permanen. **Hanya bisa dilakukan oleh admin.**

**Langkah-langkah:**

1. Buat request baru, metode **DELETE**
2. URL: `http://localhost:3000/api/users/2` (ganti `2` dengan ID user yang ingin dihapus)
3. Pasang token **admin** di tab Authorization
4. Klik **Send**

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "User berhasil dihapus"
}
```

**Kemungkinan Error:**
- `"Akses ditolak"` → Anda bukan admin
- `"User tidak ditemukan"` → ID user tidak ada di database

---

### TEST 8: Upload Foto Profil

Mengupload foto profil untuk pengguna.

**Aturan upload foto:**
- **Tipe file yang diizinkan:** JPG, JPEG, PNG, GIF
- **Ukuran maksimal:** 2 MB
- **User biasa** hanya bisa upload foto untuk akunnya sendiri
- **Admin** bisa upload foto untuk akun siapa saja

**Langkah-langkah:**

1. Buat request baru, metode **PUT**
2. URL: `http://localhost:3000/api/users/1/photo` (ganti `1` dengan ID user)
3. Pasang token di tab Authorization
4. Klik tab **Body**
5. Pilih **form-data** (bukan raw!)
6. Di kolom **Key**, ketik: `photo`
7. Di sebelah kanan kolom Key, klik dropdown dan ubah dari **Text** menjadi **File**
8. Klik **Select Files** dan pilih file gambar dari komputer Anda
9. Klik **Send**

**Hasil yang diharapkan (Status: 200 OK):**

```json
{
  "message": "Foto berhasil diupload",
  "data": {
    "photo": "user_1_1708012345678.jpg"
  }
}
```

**Cara melihat foto yang sudah diupload:**

Buka di browser: `http://localhost:3000/uploads/user_1_1708012345678.jpg` (ganti nama file sesuai response)

**Kemungkinan Error:**
- `"File foto wajib diupload"` → Tidak ada file yang dipilih
- `"Hanya file gambar yang diperbolehkan"` → File bukan gambar (misal: PDF, DOC)
- `"File too large"` → Ukuran file lebih dari 2 MB
- `"Akses ditolak"` → User biasa mencoba upload foto untuk akun orang lain

---

## Penjelasan Pesan Error

| Pesan Error | Arti | Solusi |
|-------------|------|--------|
| `Semua field wajib diisi` | Ada data yang kosong saat registrasi | Isi semua field: name, email, password |
| `Email sudah terdaftar` | Email sudah dipakai akun lain | Gunakan email yang berbeda |
| `Email dan password wajib diisi` | Data login tidak lengkap | Isi email dan password |
| `Email atau password salah` | Kredensial tidak cocok | Periksa kembali email dan password |
| `Token tidak ditemukan` | Belum menyertakan token | Pasang token di tab Authorization |
| `Token tidak valid` | Token salah atau kadaluarsa | Login ulang untuk mendapatkan token baru |
| `Akses ditolak` | Tidak punya izin untuk aksi ini | Gunakan akun dengan role yang sesuai |
| `User tidak ditemukan` | ID user tidak ada di database | Periksa ID yang digunakan |
| `File foto wajib diupload` | Tidak ada file yang dikirim | Pilih file gambar untuk diupload |
| `Hanya file gambar yang diperbolehkan` | Tipe file tidak didukung | Gunakan file JPG, JPEG, PNG, atau GIF |

---

## Alur Kerja yang Disarankan untuk Testing

Ikuti urutan ini untuk mencoba semua fitur:

```
1. Register akun pertama  → POST /api/auth/register
2. Login                   → POST /api/auth/login (simpan token!)
3. Lihat profil            → GET /api/users/profile
4. Edit profil             → PUT /api/users/1
5. Upload foto             → PUT /api/users/1/photo
6. Register akun kedua     → POST /api/auth/register (email berbeda)
7. Ubah akun pertama jadi admin (via phpMyAdmin)
8. Login sebagai admin     → POST /api/auth/login
9. Lihat semua user        → GET /api/users
10. Hapus akun kedua       → DELETE /api/users/2
```

---

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|-----------|----------|
| **Express.js v5** | Framework web server |
| **MySQL** | Database penyimpanan data |
| **JWT** | Sistem token untuk autentikasi login |
| **bcryptjs** | Enkripsi password (agar tidak tersimpan sebagai teks biasa) |
| **Multer** | Menangani upload file |
| **CORS** | Mengizinkan akses dari domain/aplikasi lain |
| **dotenv** | Membaca pengaturan dari file `.env` |
