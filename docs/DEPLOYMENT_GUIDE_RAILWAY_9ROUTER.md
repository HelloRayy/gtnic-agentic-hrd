# Panduan Deployment Cloud 24/7: TalentTrace + 9Router di Railway

Dokumen ini memuat panduan langkah demi langkah untuk menjalankan aplikasi TalentTrace dan gateway AI 9Router secara berdampingan di cloud Railway agar aktif 24 jam non-stop dan siap diakses dewan juri GTNIC 2026 tanpa bergantung pada komputer lokal.

---

## 1. Arsitektur 2-Service Railway

Di dalam satu project Railway, kita menjalankan dua kontainer mandiri:
1. **Service Web (`talenttrace-app`)**: Menjalankan frontend Vite yang telah ter-compile statis dan server Express monorepo.
2. **Service Gateway (`9router`)**: Menjalankan Docker image resmi `decolua/9router` pada port internal 20128.
3. **Jalur Komunikasi**: Service web memanggil 9Router melalui jaringan privat internal:
   `http://9router.railway.internal:20128/v1` (tanpa latensi internet publik).

---

## 2. Langkah 1: Deploy Service TalentTrace (Aplikasi Utama)

1. Buka [Railway.app](https://railway.app) dan login dengan akun GitHub Anda.
2. Klik **New Project** -> **Deploy from GitHub repo**.
3. Pilih repositori: `HelloRayy/gtnic-agentic-hrd` (branch `main`).
4. Railway akan mendeteksi `railway.json` secara otomatis:
   - Builder: Nixpacks
   - Build Command: `npm run build` (mengompilasi client dan server)
   - Start Command: `npm start`
5. Masuk ke tab **Settings** pada service tersebut, lalu klik **Generate Domain** di bagian *Networking* untuk mendapatkan URL publik HTTPS resmi (contoh: `https://talenttrace-production.up.railway.app`).

---

## 3. Langkah 2: Deploy Service 9Router (Docker Image)

1. Di dalam project Railway yang sama, klik tombol **+ New** di pojok kanan atas.
2. Pilih opsi **Docker Image**.
3. Masukkan nama image resmi: `decolua/9router` lalu tekan Enter.
4. Klik service baru tersebut, masuk ke tab **Settings**:
   - Ganti *Service Name* menjadi persis: `9router`
5. Masuk ke tab **Variables** pada service 9Router:
   - Tambahkan variabel autentikasi atau token provider AI Anda (sesuai konfigurasi 9Router yang saat ini berjalan di laptop).
6. Port 20128 akan otomatis terbuka di jaringan internal Railway.

---

## 4. Langkah 3: Sambungkan Variabel Lingkungan (Environment Variables)

Klik service **talenttrace-app**, masuk ke tab **Variables**, lalu tambahkan variabel berikut:

| Nama Variabel | Nilai / Value | Keterangan |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Mode produksi Express |
| `ROUTER_BASE_URL` | `http://9router.railway.internal:20128/v1` | URL jaringan internal ke service 9Router |
| `ROUTER_MODEL` | `gemini-3.8-flash` | Model utama (atau `ag/gemini-3.8-flash-low`) |
| `ROUTER_API_KEY` | `9router` (atau token 9Router Anda) | Kunci otentikasi internal router |
| `GITHUB_TOKEN` | Token GitHub Personal Access Anda | Mencegah rate-limit audit repo GitHub |

---

## 5. Verifikasi Akhir di Browser Juri

1. Buka domain publik Railway Anda (contoh: `https://talenttrace-production.up.railway.app`).
2. Antarmuka IDE 3-Panel TalentTrace akan langsung terbuka.
3. Klik tombol **Buka Sampel Kandidat** atau **Bandingkan Head-to-Head**.
4. Ajukan pertanyaan komparasi di panel kanan. Sistem akan memanggil 9Router di cloud secara real-time dan mengembalikan sintesis trade-off tanpa error.
