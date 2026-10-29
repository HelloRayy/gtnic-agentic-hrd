# BLUEPRINT STRATEGI STARTUP & ANALISIS KOMPETITOR
## TalentTrace AI: Autonomous Technical Screener & Portfolio Forensics Engine

Dokumen ini memetakan lanskap persaingan industri rekrutmen teknologi (AI HR Tech), menganalisis kelemahan fatal kompetitor eksisting, serta merumuskan posisi tawar unik (*unfair advantage*) dan arsitektur produk end-to-end TalentTrace AI.

---

## 1. Inti Misi & Pernyataan Masalah (Core Problem Statement)

### A. Realitas Pasar (2024–2026)
1. **Resume Inflation & Keyword Stuffing**: 
   Generative AI memudahkan pelamar menghasilkan ratusan CV yang 100% lolos ATS tradisional, namun seringkali klaim keahlian di CV tidak mencerminkan kapabilitas rekayasa perangkat lunak nyata.
2. **Krisis Tes Koding Tradisional (The Collapse of LeetCode / HackerRank)**:
   Kehadiran AI coding assistant (Cursor, Claude 3.5 Sonnet, ChatGPT) membuat tes algoritma otomatis dan tugas *take-home challenge* kehilangan validitasnya karena dapat dikerjakan AI dalam hitungan detik.
3. **Biaya Tinggi Tech Lead & Engineering Manager**:
   Untuk memverifikasi kualitas kandidat, Tech Lead dan Engineering Manager terpaksa meluangkan 15–20 jam per minggu untuk memeriksa portofolio dan riwayat koding secara manual.

### B. Misi TalentTrace AI
Mentransformasi rekrutmen teknis dari model "menyaring resume pasif & tes koding tiruan" menjadi "audit forensik portofolio rekayasa kode nyata yang otonom dan kontekstual", memangkas waktu screening hingga 80% tanpa bias algoritma *black-box*.

---

## 2. Peta Lanskap Kompetitor (Competitive Landscape)

Saat ini pasar HR Tech terbagi dalam 4 kuadran utama:

| Kategori Platform | Pemain Utama | Mekanisme Kerja | Kelemahan Fatal / Blindspot |
| :--- | :--- | :--- | :--- |
| **Traditional ATS** | Greenhouse, Workday, Lever, Taleo, Ashby | Parsing kata kunci CV, manajemen pipeline pelamar, penjadwalan manual. | Buta teknis (*zero code awareness*). Mudah dicurangi dengan *keyword stuffing*. Menjadi bottleneck bagi tim engineering. |
| **Automated Coding Assessment** | HackerRank, Codility, TestGorilla, Glider AI | Tes algoritma leetcode 60 menit, automated test suite, proctoring webcam. | Ditinggalkan senior developer (drop-off rate tinggi). 100% rentan dipecahkan AI koding. Tidak menguji arsitektur nyata. |
| **AI Resume Screener & Talent Intelligence** | Eightfold AI, Fetcher, SeekOut, Paradox | Ekstraksi profil LinkedIn/CV, pencocokan skor semantik, chatbot screening HR. | Menghasilkan skor arbitrer *black-box* yang rawan bias hukum. Tidak pernah memvalidasi artefak kode riil. |
| **AI Interview Copilot / Note Taker** | Metaview, Karat, Final Round AI | Transkripsi wawancara, ringkasan catatan HR otomatis. | Bersifat reaktif saat wawancara berlangsung. Tidak memiliki persiapan forensik pra-wawancara berbasis repositori. |

---

## 3. Analisis Kelemahan Fatal Kompetitor (The 4 Fatal Flaws)

1. **Ilusi 'Skill Score' Arbitrer (The Black-Box Fallacy)**:
   Banyak AI HRD mengklaim bisa memberikan nilai "Kandidat Skor 87/100 - Lolos". Di mata regulasi global (EU AI Act) dan Surat Edaran Menkominfo No. 9/2023, skor hitam ini rentan diskriminasi dan tuntutan hukum ketenagakerjaan.
2. **Kerapuhan terhadap AI Koding Generatif**:
   Platform asesmen berbasis kuis atau soal koding terisolasi sudah usang karena kandidat dapat menyalin soal ke LLM dan mendapatkan jawaban sempurna dalam 10 detik.
3. **Friction Tinggi bagi Senior Engineer**:
   Kandidat berpengalaman (Senior/Staff Engineer) menolak mengerjakan kuis pilihan ganda atau tugas seminggu penuh. Mereka menginginkan diskusi teknis tingkat tinggi seputar karya arsitektur nyata mereka.
4. **Ketiadaan Hubungan Antara Bukti Kode dan Sesi Wawancara**:
   Bahkan jika HR menemukan link GitHub kandidat, pewawancara tetap mengajukan pertanyaan teori klise ("Apa perbedaan interface dan abstract class?") alih-alih membedah trade-off arsitektur yang dibuat kandidat.

---

## 4. Parit Pertahanan & Nilai Unik TalentTrace AI (Our Unfair Advantage)

1. **Forensik Artefak Kode Nyata (Proof of Work > Stories)**:
   Agen tidak membaca teks klaim, melainkan membedah commit history, pohon dependensi, unit test coverage, setup CI/CD, dan authorship status (mendeteksi kode kloningan atau repositori tugas kuliah).
2. **Fact-Based Evidence Matrix (Explainable AI & Zero Arbitrary Score)**:
   Menolak mengeluarkan vonis angka. Menyajikan bukti biner transparan (`[TERVERIFIKASI]`, `[SEBAGIAN]`, `[TIDAK ADA BUKTI PUBLIK]`) sehingga keputusan mutlak tetap di tangan tim manusia (*Human-in-the-Loop*).
3. **Contextual Investigation Cheat-Sheet with Green/Red Flags**:
   Menghasilkan panduan wawancara spesifik per file dan per modul repositori, dilengkapi indikasi kompeten (*Green Flags*) dan sinyal bualan (*Red Flags*) agar pewawancara langsung tahu area verifikasi kritis.
4. **Dynamic Question Pivot**:
   Mengatasi problem kandidat lupa proyek lama dengan fitur pivot dinamis (beralih ke topik database/skalabilitas atau beralih ke repositori terbaru kandidat).
5. **Full-Lifecycle Enterprise Workspace Integration**:
   Bukan sekadar AI analitik terisolasi; terhubung langsung dengan Google Calendar (slot meeting + link Google Meet) dan Gmail untuk eksekusi workflow hiring 1-klik.

---

## 5. Arsitektur Produk End-to-End (SaaS Startup Tiering)

```
[ Pintu Masuk / Ingestion ]
    ├── CV Upload (PDF/Text)
    ├── ATS Webhook (Greenhouse / Ashby / Lever)
    └── Mode Adaptif (Publik GitHub / NDA Candidate / Take-Home ZIP)
            │
            ▼
[ Engine Forensik & Verifikasi Otonom ]
    ├── Smart Repo Triage (Non-fork, recency filter)
    ├── Structural Code Auditor (Depth-3 tree, manifest, CI/CD, test)
    ├── Anti-False-Positive Git Lens (Netralisir squash/rebase)
    └── Deterministic Fact Pre-Matcher (Node.js runtime level)
            │
            ▼
[ Intelligence Dossier & Assessment ]
    ├── Executive Technical Summary (Bahasa Indonesia & Profesional)
    ├── Claim-vs-Evidence Matrix (Status badges)
    └── Investigation Radar (Code anchors, Green & Red flags)
            │
            ▼
[ Human-in-the-Loop Deliberation & Action Hub ]
    ├── Deliberation Copilot (Tanya jawab HRD/Tech Lead dengan AI)
    ├── Dynamic Question Pivot (Ubah arah pertanyaan saat wawancara)
    ├── Google Workspace Dispatch (Google Calendar + Meet + Gmail)
    └── Export Dossier (Format PDF / Webhook ATS JSON)
```

---

## 6. Model Monetisasi & Target Pelanggan Enterprise

1. **Target Pasar**:
   - Perusahaan teknologi skala berkembang (*Scale-up*) dan Enterprise (50–500+ engineer).
   - Tech Recruitment Agency yang menangani penempatan engineer tingkat menengah hingga eksekutif.
2. **Model Bisnis SaaS B2B**:
   - **Starter / Pay-as-you-go**: Rp 75.000 – Rp 150.000 per kandidat audit komprehensif.
   - **Growth Tier**: Rp 4.500.000 / bulan (hingga 50 kandidat, 3 user seat, integrasi Google Workspace).
   - **Enterprise Tier**: Custom pricing (Unlimited candidate audit, webhook ATS kustom, SLA audit < 15 detik, on-premise LLM deployment).
