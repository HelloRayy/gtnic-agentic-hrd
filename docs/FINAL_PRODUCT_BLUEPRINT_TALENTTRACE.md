# BLUEPRINT RESMI PRODUK: TALENTTRACE ENTERPRISE
## AI-Native Engineering Talent Intelligence Platform

Dokumen ini memuat rangkuman final arsitektur produk, tata letak antarmuka pengguna (UI) bergaya IDE/LLM Workspace, serta fitur-fitur terverifikasi untuk pengembangan startup TalentTrace AI.

---

## 1. Konsep Desain Antarmuka: The AI Engineering IDE Workspace

Tata letak antarmuka dirancang menyerupai antarmuka IDE modern (seperti Cursor / VS Code) yang dipadukan dengan ruang kerja LLM:

1. **Panel Kiri (Candidate Explorer & Queue - 20% lebar)**:
   - Berfungsi seperti file tree / inbox daftar pelamar.
   - Menampilkan antrean kandidat yang masuk, badge status verifikasi (`Terverifikasi`, `Perlu Tinjauan`, `Flagged`), dan filter lowongan/keahlian.
   - HRD dapat berpindah dari satu kandidat ke kandidat lain secara instan dengan satu klik.

2. **Panel Tengah (AI Deliberation & Chat Hub - 50% lebar)**:
   - Ruang interaksi percakapan utama bergaya LLM chat.
   - Tempat HRD atau Engineering Lead berkonsultasi langsung dengan AI mengenai kandidat aktif:
     * Menanyakan bukti kode spesifik di GitHub.
     * Menganalisis potensi kecocokan untuk role lain.
     * Menghasilkan draf undangan atau draf umpan balik penolakan teknis secara langsung.

3. **Panel Kanan (Context & Technical Dossier Inspector - 30% lebar)**:
   - Berfungsi seperti panel inspektor/properti pada IDE.
   - Menampilkan fakta teknis terverifikasi:
     * Matriks Bukti Klaim vs Kode Nyata (Dependency manifests, CI/CD, unit tests).
     * Ringkasan eksekutif dan status authorship (bebas kloning/plagiarisme).
     * **Embedded Source Code Explorer & Web IDE Launcher**:
       - Mini code viewer langsung di dalam panel untuk membaca berkas inti repositori kandidat (syntax highlighting).
       - Tombol cepat 1-klik untuk membuka seluruh repositori langsung di editor web berbasis VS Code (`github.dev/username/reponame` atau `github1s.com`).
     * Tombol aksi eksekusi: Jadwalkan Google Calendar (Meet link) dan Kirim Gmail 1-klik.
---

## 2. Rincian Fitur Utama Produk Final

1. **Candidate Explorer & Ingestion Hub**:
   - Mendukung input multi-kandidat (unggah berkas CV, input batch, atau mode kandidat dengan NDA tanpa GitHub).
   - **AI Policy Toggle**: Pengaturan kebijakan lowongan `[ Toleransi AI: Diizinkan (AI-Assisted OK) / Murni Manual ]`.
   - Pengelompokan status pelamar yang teratur dan mudah dipantau.

2. **Autonomous Codebase Forensics & Technical Ownership Verifier (Core AI)**:
   - Membedah repositori GitHub asli milik kandidat secara otonom (manifes dependensi, struktur direktori level 3, authorship Git, dan unit test).
   - **Filosofi Technical Ownership (Bukan AI Witch-Hunt)**: Agen tidak menghukum kandidat karena menggunakan AI koding (Cursor/Copilot), melainkan menguji kepemilikan teknis: apakah kandidat benar-benar memahami kode yang dibuatnya.
   - Memetakan klaim di CV terhadap bukti kode nyata secara transparan tanpa skor arbitrer.
   - Merumuskan pertanyaan wawancara spesifik dengan *Green Flags* (sinyal kandidat paham logika & trade-off arsitektur) dan *Red Flags* (sinyal copy-paste buta).

3. **Take-Home Challenge & Sandbox Code Reviewer**:
   - Menilai repositori tugas teknis mandiri (*take-home challenge*) atau arsip ZIP yang dikirimkan kandidat.
   - Mengaudit arsitektur, cakupan unit test, penanganan error, dan menghasilkan draf code review otomatis layaknya Tech Lead senior.

4. **AI Deliberation Partner (Chat Konsultasi Interaktif)**:
   - Asisten konsultasi cerdas di panel tengah yang memiliki memori audit kode kandidat.
   - Memberikan jawaban berbasis fakta dengan mengutip nama berkas dan baris kode riil saat ditanya oleh Tech Lead seputar pemahaman kandidat.

5. **Head-to-Head Candidate Benchmark (Fitur Komparasi Finalis)**:
   - Membandingkan 2 hingga 3 kandidat finalis secara berdampingan pada satu layar kerja.
   - Menyandingkan kedalaman arsitektur, kelengkapan pengujian, dan kesiapan stack teknologi masing-masing kandidat secara objektif.

6. **Action Dispatcher, Constructive Feedback & Executive Export**:
   - Terintegrasi langsung dengan Google Workspace (Calendar & Gmail) untuk eksekusi undangan wawancara 1-klik (slot meeting + link Google Meet).
   - **Constructive Engineering Feedback Engine**: Menghasilkan draf umpan balik penolakan teknis yang ramah dan membangun bagi kandidat yang belum lolos, menghentikan kebiasaan *ghosting* rekrutmen dan menjaga reputasi *employer branding*.
   - **Executive PDF Export**: Kemampuan mengekspor laporan investigasi teknis lengkap ke berkas PDF resmi untuk dibagikan ke jajaran pimpinan (CTO/VP of Engineering).
