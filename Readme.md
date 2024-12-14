# Commit-AI

Commit-AI adalah alat command-line yang membantu Anda menghasilkan pesan commit otomatis berdasarkan perubahan kode Anda menggunakan model Gemini AI.

---

## Fitur Utama
- **Generate Commit Message:** Deteksi perubahan kode secara otomatis menggunakan `git diff` dan menghasilkan pesan commit.
- **Inquirer Integration:** Memberikan opsi untuk menerima, menolak, atau mengenerate ulang pesan commit langsung dari terminal.
- **Set Token:** Konfigurasi token API Gemini AI melalui CLI.

---

## Instalasi
Karena proyek ini belum terdaftar di package registry maka lakukan clone terlebih dahulu.

```bash
git clone https://github.com/rizkymiff/commit-ai.git
```

### 1. Instal Secara Global
Untuk menggunakan Commit-AI di seluruh proyek Anda:

```bash
npm install -g .
```

### 2. Instal Secara Lokal (Per-Proyek)
Untuk menggunakan Commit-AI di proyek tertentu saja:

```bash
npm install .
```

---

## Konfigurasi Token
Commit-AI memerlukan token API dari Gemini AI. Anda dapat menyetelnya dengan dua cara:

### 1. Command `set-token`
Jalankan perintah berikut:
```bash
commit-ai set-token <your-token>
```
Ini akan otomatis menyimpan token di file `.env` sebagai `GEMENI_TOKEN`.

### 2. Tambah Token Secara Manual di `.env`
Buat file `.env` di root proyek Anda jika belum ada, lalu tambahkan:
```
GEMENI_TOKEN=<your-token>
```

---

## Penggunaan

### 1. Generate Commit Message
Pastikan Anda sudah melakukan `git add` pada perubahan kode Anda. Lalu jalankan:
```bash
commit-ai generate
```

#### Output:
1. Commit-AI akan mendeteksi perubahan staged file menggunakan `git diff --cached --name-status`.
2. Pesan commit yang dihasilkan akan ditampilkan di terminal.
3. Anda akan diberi opsi:
   - **Ya**: Menggunakan pesan commit dan langsung melakukan commit.
   - **Tidak**: Membatalkan commit.
   - **Generate Ulang**: Menghasilkan pesan commit baru.

---

## Catatan
- Pastikan Anda memiliki Node.js versi 18 atau lebih baru.
- Gunakan `git` versi terbaru untuk kompatibilitas.

---

## Kontribusi
Pull request selalu diterima! Untuk perubahan besar, harap diskusikan terlebih dahulu melalui issue.

---

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

