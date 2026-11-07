# TalentTrace AI — Autonomous Technical Screener for Enterprise Teams

> **Karya Inovasi GTNIC 2026**: Kategori AI Agent (Enterprise & Industry)  
> **Sub-Tema**: Building Intelligent AI Agents for Enterprise Productivity  
> **Judul Karya**: Pengembangan Sistem AI Agent Berbasis Multi-Tool Calling untuk Otomatisasi Validasi Klaim CV dan Audit Portofolio GitHub Calon Software Engineer

---

## 1. Latar Belakang Masalah

Industri teknologi informasi saat ini menghadapi lonjakan volume lamaran kerja yang sangat masif, di mana satu lowongan pekerjaan posisi *software engineer* dapat menerima ratusan berkas hanya dalam beberapa hari. Kondisi ini memicu tantangan operasional serius bagi tim rekruter dan *Talent Acquisition*:

1. **Resume Inflation & Proyek Tutorial**: Di era keterbukaan informasi, pelamar dengan mudah mencantumkan penguasaan belasan *tech stack* mutakhir di CV. Namun, fakta di lapangan menunjukkan banyak proyek hanya berupa salinan tutorial daring (*tutorial-based project*) atau kloning repositori publik tanpa pemahaman logika kode yang mendalam.
2. **Keterbatasan Rekruter Non-Teknis**: Rekruter yang berlatar belakang non-IT kesulitan membedakan antara kandidat yang benar-benar berkompeten dengan pelamar yang sekadar mempercantik narasi di resume.
3. **Penyitaan Jam Kerja Tim Senior (High Opportunity Cost)**: Tim HRD kerap terpaksa melibatkan *Tech Lead* atau *Senior Engineer* sejak tahap skrining awal hanya untuk memeriksa repositori GitHub satu per satu. Hal ini membuang waktu produktif yang seharusnya digunakan untuk pengembangan produk inti perusahaan.
4. **Kelemahan ATS Konvensional**: Sistem *Applicant Tracking System* (ATS) berbasis *keyword matching* mudah dimanipulasi (*keyword stuffing*) dan tidak mampu mengaudit substansi serta integritas kode sumber nyata.

**TalentTrace AI** hadir sebagai solusi: agen AI otonom yang bertindak sebagai detektif kode objektif. Sistem tidak membaca teks secara pasif, melainkan mengeksekusi penyelidikan multi-alat langsung ke repositori GitHub kandidat, memeriksa riwayat komit orisinal, memverifikasi klaim berbasis bukti nyata (*grounding verification*), serta menyajikan ringkasan hasil audit yang mudah dipahami oleh rekruter.

---

## 2. Alur Kerja Sistem & Arsitektur Multi-Tool Calling

TalentTrace AI mengusung arsitektur agen cerdas berbasis pemanggilan alat khusus (*tool calling*) yang digerakkan oleh alur penalaran bertahap (*Chain-of-Thought*):

```
[ Berkas CV (PDF) & URL GitHub ]
               │
               ▼
┌──────────────────────────────┐
│  1. Ingestion & CV Parser    │ ──> Ekstrak identitas & klaim keahlian (tech stack)
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│  2. GitHub Triage Engine     │ ──> Sortir repositori publik yang paling relevan
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│  3. Deep Repository Audit    │ ──> Analisis hierarki berkas, package manifest,
│                              │     dan integritas commit author
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│  4. Grounding Verification   │ ──> Cocokkan klaim CV vs fakta kode riil
│                              │     (Terverifikasi / Parsial / Belum Ada Bukti)
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│  5. Deliberation & Action    │ ──> Dialog konsultasi teknis HRD + Satu-klik
│                              │     sinkronisasi Google Calendar & Gmail
└──────────────────────────────┘
```

### Modul dan Komponen Inti
- `cv_parser`: Mengurai berkas PDF resume kandidat menjadi profil data terstruktur.
- `github_triage`: Menyeleksi repositori publik yang paling relevan dengan posisi kerja yang dilamar.
- `github_repo_audit`: Memeriksa manifest dependensi (`package.json`, `go.mod`, `requirements.txt`), susunan berkas, serta meneliti keaslian komit pelamar.
- `techTaxonomy`: Memetakan kesetaraan teknologi serumpun (*transferable skill*) agar evaluasi tetap adil dan menyeluruh.
- `groundingVerification`: Memvalidasi klaim CV terhadap temuan repositori nyata untuk mengeliminasi halusinasi AI.
- `deliberationEngine`: Ruang dialog interaktif untuk membantu rekruter non-teknis memahami portofolio kandidat dengan analogi bahasa manusia biasa.
- `localPersistence`: Penyimpanan SQLite dengan mode *Write-Ahead Logging* (WAL) dan sistem *caching* 2 lapis (RAM + Disk) untuk kedaulatan data internal, audit trail instan, serta efisiensi kuota API.

---

## 3. Fitur Utama & Dampak Efisiensi Operasional

### Fitur Utama
- **Matriks Kesesuaian Kualifikasi (Fact Matrix)**: Komparasi transparan antara klaim CV dan bukti kode nyata di GitHub, lengkap dengan lencana status verifikasi dan rujukan berkas pendukung.
- **Penjelajah Pohon Berkas (Repo Tree Explorer)**: Panel visual untuk meninjau susunan direktori proyek kandidat langsung di dalam aplikasi tanpa perlu berpindah tab peramban.
- **Ruang Diskusi Interaktif (Deliberation Workspace)**: Asisten tanya-jawab tempat rekruter berkonsultasi mengenai istilah teknis pelamar serta mendapatkan saran pertanyaan wawancara terarah.
- **Eksekusi Aksi Terintegrasi (Google Workspace)**: Tindakan otomatis satu klik untuk menjadwalkan wawancara di Google Calendar dan menyiapkan draf email tindak lanjut melalui Gmail.

### Metrik Efisiensi Operasional
- **Waktu Skrining Awal**: Terpangkas dari rata-rata 3–5 hari kerja menjadi 3–5 menit per kandidat.
- **Penghematan Jam Kerja Senior**: Menghemat 10–15 jam kerja per minggu bagi *Tech Lead* dari pekerjaan administratif memeriksa portofolio manual.
- **Pencegahan Salah Rekrut (Bad Hire)**: Mengurangi risiko lolosnya kandidat yang mengandalkan portofolio tiruan atau klaim resume semu.

---

## 4. Batasan Sistem & Prinsip Human-in-the-Loop

1. **Akses Repositori Publik**: Sistem secara etis dan teknis hanya memeriksa repositori yang disetel publik untuk menghormati privasi dan perjanjian kerahasiaan (*Non-Disclosure Agreement* / NDA) proyek masa lalu kandidat.
2. **Mitigasi False Negative**: Menerapkan prinsip *Human-in-the-Loop*. Agen AI berfungsi sebagai pendukung keputusan (*decision support tool*) berbasis bukti, bukan penentu kelulusan mutlak. Rekruter memegang kendali penuh atas keputusan akhir.
3. **Format Dokumen**: Sistem memprioritaskan dokumen PDF berbasis teks digital standar dan memberikan notifikasi transparan jika berkas berupa hasil pemindaian (*scan*) yang tidak memiliki lapisan teks terbaca.

---

## 5. Rencana Pengembangan Lanjutan (Roadmap)

- **Dukungan Multiplatform**: Integrasi penelusuran repositori di luar GitHub, seperti GitLab, Bitbucket, dan instalasi *self-hosted Git* internal perusahaan.
- **Model Bahasa Mandiri (On-Premise LLM)**: Fleksibilitas menjalankan model bahasa terbuka (*open-source* seperti Llama atau Qwen) di server lokal untuk perusahaan dengan kepatuhan data ketat (perbankan dan finansial).
- **Integrasi HRIS**: Penyediaan REST API dan *webhook* untuk sinkronisasi otomatis status pelamar ke perangkat lunak HRIS korporat.
- **Sandbox Code Runner**: Lingkungan kontainer terisolasi untuk menguji apakah proyek kandidat benar-benar dapat dikompilasi dan dijalankan (*runnable*).

---

## 6. Panduan Menjalankan Sistem & Pengujian

### Prasyarat
- Node.js v20+ atau v22+
- NPM v10+

### Instalasi & Dev Server
```bash
# Pasang seluruh dependensi proyek
npm install

# Jalankan server backend dan client frontend secara bersamaan
npm run dev
```
- Client Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Menjalankan Pengujian Otomatis
```bash
# Menjalankan 22 unit test otomatis (Vitest)
npm test
```

---

## 7. Atribusi & Dependensi Pihak Ketiga

Karya inovasi ini dikembangkan secara independen untuk ajang GTNIC 2026 dengan memanfaatkan pustaka dan lisensi terbuka berikut:
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React, HugeIcons React, dan Atlassian Design Tokens (`@atlaskit/tokens`).
- **Backend**: Express, TypeScript, SQLite3 (WAL mode), Octokit (GitHub REST API), Google APIs (Calendar & Gmail).
- **Inovasi Orisinal**: Seluruh logika orkestrasi agen, alur *tool-calling*, taksonomi kesetaraan keahlian, dan *grounding verification pipeline* dirancang dan diimplementasikan secara mandiri oleh tim pengembang.
