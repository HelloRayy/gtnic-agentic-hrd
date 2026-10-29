# BRAINSTORMING FITUR & ARSITEKTUR UI: INBOX REKRUTMEN ENTERPRISE
## TalentTrace AI: Split-Pane Master-Detail & High-Volume Triage

Dokumen ini memuat konsep arsitektur antarmuka pengguna (UI/UX) bergaya split-pane (WhatsApp/Superhuman/Linear) untuk menangani ratusan pelamar teknis, serta fitur-fitur ekspansi startup bernilai tinggi.

---

## 1. Konsep Desain: Master-Detail Candidate Inbox (Split-Pane UI)

### Masalah pada UI Konvensional:
Formulir input tunggal (upload satu per satu) hanya cocok untuk demo skrip sederhana. Di dunia nyata enterprise, HRD menerima 50–500 pelamar per lowongan dan membutuhkan antarmuka yang cepat, navigasi tanpa reload halaman, dan pemilahan instan.

### Solusi UI: Split-Pane Inbox (Linear / WhatsApp Pattern):
- **Sisi Kiri (Master Candidate Feed - 30% lebar layar)**:
  - Berbentuk daftar kartu ringkas kandidat seperti chat list WhatsApp.
  - Setiap kartu menampilkan: Nama kandidat, posisi yang dilamar, status audit (Verified, Partial, Flagged, In-Audit), cuplikan temuan kunci, dan waktu masuk lamaran.
  - Dilengkapi tab filter cepat: `[ Semua (42) ]`, `[ Butuh Review (8) ]`, `[ Terjadwal (5) ]`, `[ Talent Pool (12) ]`.
  - Dilengkapi search bar instan: Cari berdasarkan nama, teknologi (`Go`, `Kubernetes`), atau status verifikasi.
- **Sisi Kanan (Active Dossier & Deliberation Room - 70% lebar layar)**:
  - Menampilkan dossier teknis lengkap kandidat yang sedang dipilih secara instan tanpa reload.
  - Memuat: Ringkasan Eksekutif, Matriks Bukti Kode, Radar Investigasi Forensik, Deliberation Copilot Chat, dan Tombol Aksi 1-Klik.

---

## 2. Fitur-Fitur Ekspansi Bernilai Tinggi (Brainstorming)

### Fitur A: Deliberation Room (Chat Konsultasi Interaktif HRD + Tech Lead + AI)
- **Konsep**: Seperti ruang obrolan internal di sisi kanan bawah dossier.
- **Kemampuan AI**:
  - Rekruter dapat bertanya apa saja tentang kandidat secara mendalam:
    * *"Apakah kandidat ini punya pengalaman indexing database Postgres tingkat lanjut?"*
    * *"Di antara repo-nya, mana yang arsitekturnya paling siap untuk enterprise?"*
    * *"Jika kita rekrut untuk role DevOps alih-alih Frontend, seberapa siap infrastruktur yang pernah dia buat?"*
  - AI menjawab dengan mengutip berkas konkret, path direktori, dan baris kode nyata dari memori audit repositori.
  - Anggota tim (HRD & Tech Lead) dapat meninggalkan catatan internal (*collaborative hiring notes*).

### Fitur B: Autonomous Batch Triage & Candidate Clustering
- **Konsep**: Saat 50 CV diunggah sekaligus (ZIP atau integrasi ATS), agen bekerja di latar belakang.
- **Klasterisasi Otomatis**:
  - Mengelompokkan pelamar ke dalam klaster kompetensi teknis:
    * Klaster 1: *Production-Grade Distributed Systems* (Memiliki bukti nyata mikroservis, Docker, CI/CD).
    * Klaster 2: *Strong Junior / Portfolio Builder* (Memiliki kode bersih tapi proyek skala kecil).
    * Klaster 3: *AI-Inflated / High Plagiarism Risk* (Banyak fork, klaim CV bombastis tanpa bukti repo).
- Menghemat 95% waktu pemilahan awal HRD.

### Fitur C: Head-to-Head Candidate Benchmark (Komparasi 2–3 Kandidat)
- **Konsep**: Ketika ada 2 atau 3 finalis untuk 1 posisi, HRD dapat memilih tombol "Bandingkan Kandidat".
- **Matriks Komparasi Realistis**:
  - Membandingkan kedalaman arsitektur, cakupan unit test, keteraturan commit Git, dan kecocokan stack teknologi secara berdampingan (*side-by-side card*).
  - Tanpa skor bias, murni komparasi fakta rekayasa.

### Fitur D: Live Interviewer Companion & Dynamic Question Pivot
- **Konsep**: Mode khusus saat pewawancara sedang bertatap muka (atau di Google Meet) dengan kandidat.
- **Fitur Interaktif**:
  - *Dynamic Question Pivot*: Tombol satu-klik untuk mengganti topik pertanyaan jika kandidat blank atau gugup.
    * `[ 🔄 Pivot ke Repo Paling Baru ]`
    * `[ 🔀 Pivot ke Topik: Database & Query Optimization ]`
    * `[ 🔀 Pivot ke Topik: Testing & CI/CD Pipeline ]`
  - *Live Observation Pad*: Kolom pencatatan respon kandidat yang langsung dirangkum AI menjadi rekomendasi konsensus hiring di akhir sesi.

### Fitur E: Auto-Generated Feedback Engine (Pemberantas Ghosting Rekrutmen)
- **Konsep**: Salah satu rasa frustrasi terbesar developer adalah di-*ghosting* setelah melamar.
- **Kemampuan Agen**:
  - Menghasilkan draf email penolakan yang sopan, konstruktif, dan berbasis teknis (*constructive engineering feedback*).
  - Contoh: *"Terima kasih telah melamar. Portofolio Go Anda di repo X sangat baik, namun untuk posisi Senior ini kami memprioritaskan kandidat dengan rekam jejak langsung dalam orchestrasi Kubernetes di lingkungan produksi..."*
  - Meningkatkan reputasi *employer branding* perusahaan secara masif.
