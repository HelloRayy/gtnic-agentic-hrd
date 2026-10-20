# Ringkasan Technical Meeting GTNIC 2026 - Kategori AI Agent

Dokumen ini memuat rangkuman teknis hasil Technical Meeting (TM) sesi AI Agent untuk kompetisi Garda Tech National Innovation Competition (GTNIC) 2026 berdasarkan pemaparan Saudara Khoirudin Effendi (Koor AI Agent).

---

## 1. Lingkup dan Definisi Solusi

- **Fokus Utama**: Menyelesaikan masalah operasional bisnis internal atau kebutuhan industri/enterprise secara nyata (Problem-First).
- **Contoh Use Case**: Customer service autonomous agent, automated invoicing/reporting, data analysis & decision support, otomasi operasional bisnis.
- **Bukan Sekadar Chatbot**: Dilarang keras hanya membuat wrapper LLM (forwarding prompt ke API ChatGPT lalu diteruskan ke frontend).
- **Karakteristik Wajib AI Agent**:
  - Memiliki alur kerja perencanaan (*planning*).
  - Menggunakan tools (*tool calling* / pemanggilan API / manipulasi database).
  - Melakukan eksekusi tindakan mandiri (*autonomous action execution*).
  - Sangat disarankan mengintegrasikan RAG (*Retrieval-Augmented Generation*) untuk dokumen perusahaan.

---

## 2. Ketentuan Teknis & Arsitektur

- **Layer LLM / Model**:
  - Bebas menggunakan provider API komersial (OpenAI, Gemini), model open-source, model router, atau fine-tuned model sendiri.
  - Bebas menggunakan provider gratis maupun berbayar.
- **Framework & Backend**:
  - Bebas memilih: LangChain, LangGraph, framework agen (Hermes, OpenDevin), maupun low-code workflow (n8n).
  - Jika menggunakan n8n atau framework seperti Hermes, peserta wajib melampirkan export workflow dan memaparkan arsitektur logika secara rinci dalam proposal.
- **Antarmuka & Deployment**:
  - Wajib memiliki antarmuka (UI), sangat disarankan berbasis web agar mudah diakses juri.
  - Wajib dideploy secara publik (online) melalui VPS atau hosting cloud. Juri tidak melakukan pengetesan lewat localhost peserta.

---

## 3. Komponen Deliverables & Format Berkas

1. **Link Aplikasi Publik**: URL sistem AI Agent yang aktif dan stabil.
2. **Repository GitHub**:
   - Wajib berstatus publik (tidak boleh di-private).
   - Git commit history yang wajar dan terstruktur menjadi indikator keaslian karya.
   - Boleh dipisah jika terdapat layer backend/agent dan frontend terpisah.
3. **Proposal (PDF)**:
   - Format penamaan wajib: `GTNIC_2026_AGENT_<Nama Tim>.pdf`
   - Berisi latar belakang masalah, arsitektur AI Agent, tools/integrasi yang digunakan, dan value added bisnis.
4. **Video Demo**:
   - Durasi maksimal 3 hingga 5 menit bergaya *pitching deck*.
   - Fokus pada alur kerja utama agent dan demonstrasi solusi.
   - Wajib diunggah ke YouTube (unlisted/public) atau Google Drive publik.
5. **Surat Pernyataan Keaslian Karya**:
   - Wajib dibubuhi materai resmi sesuai template di Google Drive panitia.

---

## 4. Kriteria Penilaian

- **Kemampuan dan Otonomi Agent**: Pemisahan jelas antara bot percakapan biasa dengan AI Agent otonom.
- **Penalaran dan Perencanaan**: Kemampuan agent menganalisis kondisi, memecah tugas, dan mengambil keputusan.
- **Tool Calling & Eksekusi Tindakan** (Bobot 15%): Presisi pemanggilan tools, API eksternal, dan integrasi database.
- **Arsitektur Sistem**: Kerapian rancangan alur reasoning, orkestrasi agent, dan ketahanan sistem.
- **Inovasi & Dampak Bisnis**: Relevansi solusi terhadap masalah operasional enterprise.
- **Dokumentasi & Presentasi**: Kualitas laporan proposal, live demo, dan kejelasan pitch video.

---

## 5. Timeline Penting

- **Batas Akhir Pengumpulan (Submit)**: Selasa, 10 November 2026, pukul 23:59 WIB.
- **Pengumuman 5 Besar (Top 5 Finalis)**: Seleksi berdasarkan proposal, repositori, dan demo.
- **Babak Final (Pitching Deck)**: 14 November 2026 langsung di hadapan dewan juri.
