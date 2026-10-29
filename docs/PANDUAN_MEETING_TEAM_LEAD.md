# PANDUAN EKSEKUTIF TEAM LEAD: AGENDA MEETING TIM
## Proyek: TalentTrace AI (Kompetisi GTNIC 2026)

Dokumen ini adalah *cheatsheet* taktis bagi Team Lead untuk memimpin meeting tim besok pagi (durasi ideal: 25–30 menit) agar terarah, percaya diri, dan menghasilkan pembagian tugas yang jelas tanpa perdebatan berlarut-larut.

---

## 1. Struktur Agenda Meeting (Timeboxing 30 Menit)

| Waktu | Agenda | Penanggung Jawab | Output yang Diharapkan |
| :--- | :--- | :--- | :--- |
| **00:00 - 05:00** | Live Demo Produk Berjalan (Show, Don't Tell) | Team Lead | Seluruh tim melihat bukti sistem nyata sudah aktif. |
| **05:00 - 12:00** | Pemaparan Blueprint Startup (Layout IDE 3-Kolom) | Team Lead | Kesamaan visi (*alignment*) arsitektur akhir. |
| **12:00 - 22:00** | Pembagian Tugas Kerja 3 Developer | Seluruh Tim | Setiap orang memiliki kartu tugas konkret. |
| **22:00 - 30:00** | Penguncian Jadwal & Tenggat Pengumpulan | Seluruh Tim | Komitmen milestone menuju 10 November. |

---

## 2. Naskah Demo 5 Menit (Script Team Lead)

Sebelum membuka ruang diskusi, langsung jalankan demo di laptop Anda:
1. Buka 2 terminal: `npm run dev:server` dan `npm run dev:client`.
2. Buka `http://localhost:5173`.
3. Klik tombol **Muat Sampel Kandidat Uji**.
4. Sambil sistem berjalan, katakan ke tim:
   > *"Teman-teman, sistem inti kita sudah jalan. Agen ini mengekstrak klaim CV, melakukan triase repositori GitHub, mengaudit struktur dependensi dan unit test secara otonom, lalu menampilkan log penalaran CoT secara real-time dalam hitungan detik."*
5. Saat Dossier muncul, tunjukkan tab **Inspeksi Kode Web IDE** dan klik tombol **Buka di github.dev**:
   > *"Lihat, pewawancara tidak perlu git clone ke laptop. Cukup satu klik, seluruh kodingan asli pelamar langsung terbuka di VS Code resmi berbasis web."*

---

## 3. Matriks Pembagian Tugas 3 Developer (The Delegation Cards)

### Developer 1 (Anda / Team Lead & AI Backend Architect)
- **Fokus Utama**: Orkestrasi Agen, Endpoint Chat Deliberation, dan Ketahanan Sistem.
- **Tugas Spesifik**:
  1. Membuat endpoint `/api/audit/chat` agar tim HRD/Tech Lead bisa mengobrol interaktif dengan AI mengenai kandidat aktif.
  2. Menjaga integrasi LLM router (Gemini 3.8 Flash, dual-stream synthesis, dan fallback).
  3. Memastikan integrasi Google Workspace (Calendar & Gmail) siap dihubungkan saat fase demo akhir.

### Developer 2 (Frontend & Design System Engineer)
- **Fokus Utama**: Tata Letak Antarmuka 3 Kolom (IDE Workspace) menggunakan Atlassian Design System.
- **Tugas Spesifik**:
  1. Mengubah tampilan form statis menjadi **Split-Pane 3 Kolom**:
     - Kolom Kiri: Antrean pelamar / Candidate Queue (list kartu pelamar).
     - Kolom Tengah: Ruang obrolan Deliberation Chat.
     - Kolom Kanan: Dossier Inspector (matriks bukti, investigasi, dan tombol github.dev).
  2. Memastikan antarmuka responsif dan bebas bug linter/tipe data.

### Developer 3 (Documentation, Benchmark Dataset & Video Pitch)
- **Fokus Utama**: Berkas Administrasi Lomba, Proposal Resmi GTNIC, dan Storyboard Pitch.
- **Tugas Spesifik**:
  1. Menyusun dokumen proposal PDF maksimal 15 halaman sesuai format panduan GTNIC (margin 4-3-3-3, diagram arsitektur, tabel ROI).
  2. Menyiapkan 3 profil kandidat benchmark untuk demo:
     - Kandidat A: Senior Fullstack Engineer (portofolio komprehensif terverifikasi).
     - Kandidat B: Backend Go Engineer (proyek mikroservis).
     - Kandidat C: NDA Candidate (kandidat tanpa GitHub publik untuk menguji fallback reasoning).
  3. Menulis storyboard skrip video demo 3–5 menit untuk YouTube/Google Drive.

---

## 4. Milestone Menuju Tenggat GTNIC (10 November 2026)

- **Hari 1–3**: Tata letak 3 Kolom dan Chat Deliberation selesai terintegrasi.
- **Hari 4–5**: Draf proposal PDF 15 halaman selesai dan ditinjau bersama.
- **Hari 6**: Deployment aplikasi ke URL publik (VPS / Cloud hosting) dan uji kestabilan.
- **Hari 7**: Perekaman dan editing video demo 3–5 menit.
- **Hari 8**: Pengumpulan berkas final melalui Google Form panitia sebelum 10 November pukul 23:59 WIB.
