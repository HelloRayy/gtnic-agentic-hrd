# CATATAN RISET: DEVELOPER PRODUCTIVITY & GOOGLE ENGINEERING KPI
*Arsip Riset Ide Awal & Dasar Pemilihan Topik Kompetisi GTNIC 2026*

---

## 1. Fakta Sistem Evaluasi Engineer di Google (Perf ke GRAD)

Berdasarkan riset mendalam terhadap budaya rekayasa perangkat lunak Google dan Big Tech:

### A. Mitos "Banyak Kode = KPI Naik"
* **Lines of Code (LoC) Dilarang Menjadi KPI**: Google secara eksplisit menolak metrik jumlah baris kode untuk mengukur performa atau promosi.
* **Prinsip "Code is a Liability, Not an Asset"**: Insinyur yang berhasil menyederhanakan arsitektur atau menghapus ribuan baris kode usang (*dead code*) mendapatkan penghargaan lebih tinggi daripada yang menulis kode bertele-tele.
* **Hukum Goodhart (*Goodhart's Law*)**: *"When a metric becomes a target, it ceases to be a good metric."* Menilai engineer dari volume kode atau commit hanya akan memicu manipulasi sistem (*gaming the system*).

### B. Bagaimana Google Sebenarnya Mengukur Kinerja (GRAD Framework)
* **GRAD (Googler Reviews and Development)**: Berevolusi dari sistem lama *Perf* (2x setahun) menjadi 1 siklus rating tahunan dengan promosi 2x setahun.
* **Fokus Mutlak pada IMPACT & SCOPE**:
  * Evaluasi didasarkan pada dampak nyata terhadap bisnis atau keandalan sistem (misal: memangkas latensi 35%, meningkatkan throughput 10M QPS).
  * Menangani masalah ambigu berbobot tinggi yang memakan waktu riset berbulan-bulan (meski commit akhirnya kecil) dihargai jauh lebih tinggi dibanding ratusan tiket perbaikan minor.
* **Metrik Produktivitas Organisasi (EngProd)**:
  * Google menggunakan framework GSM (*Goals/Signals/Metrics*), SPACE, dan DORA (*Deployment Frequency, Lead Time, MTTR, Change Failure Rate*).
  * Metrik ini hanya dipakai untuk mengevaluasi kualitas perkakas internal (*internal DevEx / tooling*), **BUKAN untuk perangkingan (*stack ranking*) individu**.

---

## 2. Alasan Pivot ke "TalentTrace AI" (Pertimbangan Taktis Lomba 3 Minggu)

Meskipun topik *Developer KPI & EngOps Intelligence* sangat inovatif, diputuskan untuk beralih ke **TalentTrace AI (Technical Talent Screener & GitHub Auditor)** dengan pertimbangan:

1. **Risiko Over-Scope & Ketergantungan API Eksternal**:
   * Sistem KPI Developer membutuhkan integrasi data riil ke GitHub + Jira/Linear + Slack + HRIS. 
   * Menguji coba dan mendemonstrasikannya di Zoom butuh mock data yang sangat banyak dan kompleks, berisiko tinggi terjadi galat (*demo failure*).
2. **Kesesuaian Langsung dengan Contoh Panduan**:
   * *AI Recruitment Agent* tertulis secara eksplisit sebagai contoh topik resmi di halaman 3 Buku Panduan GTNIC 2026.
3. **Peluang Eksekusi Sempurna dalam 3 Minggu**:
   * TalentTrace AI berfokus pada alur yang stabil: CV PDF $\rightarrow$ GitHub Official API $\rightarrow$ Evidence Matrix $\rightarrow$ Interview Kit.
   * Tingkat keberhasilan demo live mendekati 100% tanpa risiko ketergantungan sistem enterprise yang rumit.
