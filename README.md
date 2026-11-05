# TalentTrace AI — Autonomous Technical Screener for Enterprise Teams

> **Karya Inovasi GTNIC 2026**: Kategori AI Agent  
> **Judul Projek**: AI Agentic HRD (TalentTrace)

---

## 1. Ringkasan Eksekutif

**TalentTrace AI** adalah sistem AI Agent otonom yang dirancang khusus untuk memvalidasi klaim keahlian teknis pelamar kerja secara objektif dan berbasis bukti nyata (*ground truth*). 

Alih-alih hanya mengandalkan kata kunci pada berkas CV, TalentTrace AI mengaudit repositori publik kandidat di GitHub, membedah struktur kode dan integritas riwayat commit, mencocokkan keahlian serumpun (*transferable skill taxonomy*), serta menyusun dossier forensik komprehensif bagi tim rekrutmen.

---

## 2. Arsitektur Agen & Runtutan Penalaran (Chain-of-Thought)

Sistem agen bekerja melalui siklus terstruktur:
1. **Plan & Ingestion**: Ekstraksi berkas CV (PDF) menjadi profil kandidat terstruktur (`cv_parser`).
2. **Tool Invocation**: Mengaudit repositori GitHub publik (`github_auditor`), membedah dependency manifest dan struktur berkas kode.
3. **Observation & Taxonomy**: Menguji keaslian commit author dan memetakan keahlian menggunakan taksonomi teknologi serumpun (`techTaxonomy`).
4. **Reflection & Dossier Generation**: Merangkum Evidence Matrix, menyusun radar investigasi wawancara teknis, dan mencatat seluruh jejak berpikir ke dalam `TraceStore`.

---

## 3. Menjalankan Projek & Pengujian

### Prasyarat
- Node.js v20+ atau v22+
- NPM

### Instalasi & Dev Server
```bash
# Menjalankan backend server dan frontend client secara bersamaan
npm run dev
```
- Client Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Menjalankan Pengujian Otomatis (Automated Test Suite)
```bash
npm test
```

---

## 4. Atribusi Pustaka & Lisensi Pihak Ketiga (Third-Party Acknowledgements)

Karya inovasi ini dikembangkan secara jujur dan independen oleh tim pengembang sesuai standar orisinalitas GTNIC 2026. Dalam penyusunan sistem, projek ini memanfaatkan pustaka dan aset visual berlisensi publik sebagai dependensi pendukung antarmuka:
- **Komponen & Desain UI**: Menggunakan token dan utilitas dari `@atlaskit/tokens`, `@tailwindcss/vite`, dan ikon dari `lucide-react`.
- **Aset Karakter Visual**: Aset karakter 3D visual diadaptasi dari materi visual berlisensi bebas/open-source yang disesuaikan secara khusus untuk persona asisten TalentTrace.
- **Inovasi Inti**: Seluruh logika alur agent, pipeline audit forensik kode, kalkulator kesetaraan keahlian, dan registry tool dikembangkan secara orisinal oleh tim pengembang.
