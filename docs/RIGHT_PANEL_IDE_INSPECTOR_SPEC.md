# SPESIFIKASI TEKNIS & DEKOMPOSISI TUGAS: RIGHT PANEL MINI FORENSIC IDE
**Dokumen Panduan Eksekusi 3 AI Coding Agent**
*Domain: TalentTrace Workspace — Right Inspector Panel Redesign*
*Target Repositori: GTNIC 2026 (Enterprise Productivity Agent)*

---

## 1. Visi & Tujuan Arsitektur Right Panel
Right Panel bertransformasi dari sekadar panel informasi statis dan tombol tautan luar menjadi **Mini Forensic IDE (In-App VS Code Inspector)**. 

### Alur Pengalaman Pengguna (UX Goal):
1. Tech Lead / User dapat menginspeksi bukti fisik kode sumber kandidat langsung di dalam panel kanan aplikasi tanpa perlu membuka tab baru atau melakukan `git clone` lokal.
2. Panel menyediakan tab berkas kodingan (`package.json`, berkas controller/service, berkas infrastruktur Docker/Kubernetes) yang berpindah secara instan saat diklik.
3. Editor memiliki tampilan gelap modern dengan nomor baris kode dan **Forensic Callout Pin** (kotak anotasi highlight inline pada baris kode tertentu yang memvalidasi klaim CV vs fakta AST).

---

## 2. Kontrak Data & Tipe Bersama (Shared Interfaces)
Semua agen wajib mematuhi kontrak tipe data ini agar tidak terjadi benturan integrasi:

```typescript
export interface ForensicCallout {
  startLine: number;
  endLine: number;
  type: 'VERIFIED' | 'PARTIAL' | 'WARNING';
  claimTitle: string;
  astEvidenceSummary: string;
}

export interface IdeFileSnippet {
  id: string;
  fileName: string;
  filePath: string;
  language: 'typescript' | 'javascript' | 'json' | 'go' | 'python' | 'yaml' | 'sql';
  code: string;
  callouts: ForensicCallout[];
}
```

---

## 3. Pembagian 3 Tugas Mandiri (Decoupled Multi-Agent Tasks)

### TUGAS 1: Shell Jendela IDE & Navigasi Berkas (Agent-1: UI Shell & Tabs)
* **Penanggung Jawab**: Agent 1 (Spesialis UI Shell & Workspace Navigation)
* **Target File**:
  1. `client/src/features/workspace/components/ContextInspectorPanel.tsx` (Perapian header tab utama)
  2. `client/src/features/workspace/components/inspector/IdeEditorShell.tsx` (Komponen baru shell IDE)
  3. `client/src/features/workspace/components/inspector/IdeFileTabs.tsx` (Komponen tab bar file aktif)
* **Batasan File**: Maksimal 250 baris per file. Dilarang membuat file monolitik.
* **Rincian Pekerjaan**:
  1. **Tab Utama Right Panel**:
     - Urutkan 4 tab: `IDE` (Code2), `Matriks` (BookOpen), `Radar` (Sparkles), dan `Aksi` (Calendar).
     - Berikan status visual aktif dengan latar belakang putih dan teks tegas sesuai token tema OpenDots.
  2. **Struktur Jendela IDE (`IdeEditorShell.tsx`)**:
     - Bagian atas memuat 3 titik kontrol jendela ala macOS (merah `#ef4444`, kuning `#f59e0b`, hijau `#10b981`).
     - Tampilkan breadcrumbs path berkas aktif (contoh: `repo-kandidat / src / services / tokenService.ts`) dan badge bahasa pemrograman di pojok kanan.
     - Sediakan wadah (*container*) tempat `IdeCodeViewer` dirender dengan latar belakang gelap terintegrasi.
  3. **Tab Bar Berkas Kodingan (`IdeFileTabs.tsx`)**:
     - Render deretan tab horizontal berkas kodingan yang siap diinspeksi.
     - Setiap tab menampilkan ikon berkas, nama berkas, dan indikator titik jika berkas tersebut memuat bukti AST terverifikasi.
     - Menangani event `onSelectFile(fileId: string)`.
  4. **Aksi Cepat di Footer IDE**:
     - Tombol `Buka Full di github.dev` (mengarah ke tautan peramban VS Code).
     - Tombol `Salin Snippet Kode` untuk kemudahan catatan sesi wawancara.
* **Kriteria Selesai (Acceptance Criteria)**:
  - Jendela IDE ter-render kokoh di panel kanan dengan tombol kontrol window, breadcrumb file dinamis, dan tab berkas yang bisa diklik berpindah aktif.

---

### TUGAS 2: Code Viewer & Forensic AST Annotation Engine (Agent-2: Code Editor & Callout)
* **Penanggung Jawab**: Agent 2 (Spesialis Visual Editor & Micro-Interactions)
* **Target File**:
  1. `client/src/features/workspace/components/inspector/IdeCodeViewer.tsx` (Komponen baru visual kode)
  2. `client/src/features/workspace/components/inspector/ForensicCalloutPin.tsx` (Komponen baru anotasi inline)
* **Batasan File**: Maksimal 250 baris per file. Komponen murni presentasional, tanpa query API langsung.
* **Rincian Pekerjaan**:
  1. **Kanvas Editor Kode (`IdeCodeViewer.tsx`)**:
     - Latar belakang bertema gelap (`bg-[#1c1d22]` atau `#1e1f26`), kontras tinggi dengan teks kode yang tajam dan nyaman dibaca.
     - Kolom nomor baris (*gutter line numbers*) di sisi kiri (`1, 2, 3...`) dengan warna muted (`#5c6070`), sejajar presisi dengan baris teks kode.
     - Teks kode menggunakan font monospace (`font-mono text-xs leading-relaxed`).
     - Membaca baris kode dari prop `code: string`.
  2. **Mesin Anotasi Bukti AST (`ForensicCalloutPin.tsx`)**:
     - Mendeteksi baris kode yang cocok dengan `callouts: ForensicCallout[]`.
     - Baris yang memuat bukti forensik diberikan latar belakang highlight transparan (contoh: `bg-[#7285d5]/15 border-l-2 border-[#7285d5]`).
     - Tepat di bawah blok baris yang bersangkutan, sisipkan kotak anotasi interaktif (*inline callout box* mirip GitHub code review comment):
       - Header: Badge status verifikasi (*VERIFIED* warna hijau `#2e7d32`, *PARTIAL* warna oranye `#b7791f`).
       - Judul Klaim: Klaim CV yang dibuktikan (contoh: `Klaim CV: Arsitektur Mikroservis & Locking Token`).
       - Bukti AST Faktual: Ringkasan temuan sintaksis agen (contoh: `Ditemukan penggunaan sync.Mutex dan rotasi token JWT pada baris 24-38`).
  3. **State Kosong & Penanganan Berkas Panjang**:
     - Mendukung scrolling vertikal dan horizontal yang halus tanpa merusak layout luar panel kanan.
* **Kriteria Selesai (Acceptance Criteria)**:
  - Kode ditampilkan dengan nomor baris presisi, dan baris yang memiliki callout bukti langsung di-highlight lengkap dengan kotak penjelasan AST di sela baris kode.

---

### TUGAS 3: Generator Data Berkas & Adapter Integrasi (Agent-3: Data Adapter & Pipeline Wire)
* **Penanggung Jawab**: Agent 3 (Spesialis Transformasi Data & Integrasi State)
* **Target File**:
  1. `client/src/features/workspace/services/ideCodeAdapter.ts` (File baru: logika transformasi berkas)
  2. `client/src/features/workspace/components/inspector/WebIdeInspectorView.tsx` (Penggabungan shell dan data)
  3. `client/src/features/workspace/components/inspector/EvidenceMatrixView.tsx` (Penambahan tombol lompat ke IDE)
* **Batasan File**: Maksimal 250 baris per file.
* **Rincian Pekerjaan**:
  1. **Pembuat Snippet Berkas Dinamis (`ideCodeAdapter.ts`)**:
     - Fungsi utama: `generateIdeSnippets(dossier: TechnicalDossier): IdeFileSnippet[]`.
     - Mengolah data `dossier.evidenceMatrix`, `dossier.auditedRepos`, dan `dossier.manifestFiles`.
     - Menghasilkan 3–5 berkas realistis dengan kode sumber nyata/terverifikasi:
       - **Berkas 1 (Manifest)**: `package.json` / `go.mod` / `requirements.txt` yang memuat dependensi riil kandidat. Callout membuktikan klaim framework/library.
       - **Berkas 2 (Core Logic)**: Berkas implementasi logika utama (misal `auth.service.ts` atau `order.controller.go`) dengan callout AST untuk klaim arsitektur.
       - **Berkas 3 (Infrastruktur/DevOps)**: `docker-compose.yml` / `Dockerfile` / `.github/workflows/ci.yml` membuktikan klaim container atau CI/CD.
     - Menyediakan fallback cerdas jika kandidat belum memiliki repositori lokal, sehingga data demo tetap konsisten dan tidak pernah menghasilkan layar kosong.
  2. **Integrasi ke `WebIdeInspectorView.tsx`**:
     - Menggantikan tampilan lama yang hanya berupa tombol tautan luar dengan komponen gabungan `IdeEditorShell` + `IdeCodeViewer`.
     - Mengelola state berkas aktif: `const [activeFileId, setActiveFileId] = useState<string>(...)`.
  3. **Interaktivitas Antar-Tab (Cross-Tab Teleport)**:
     - Di `EvidenceMatrixView.tsx`, tambahkan tombol kecil pada setiap item klaim: `[Inspeksi Kode]`.
     - Jika diklik, tab langsung berpindah ke `IDE` dan membuka berkas serta melompat ke baris yang bersangkutan.
* **Kriteria Selesai (Acceptance Criteria)**:
  - Berkas kodingan otomatis terbentuk dari hasil dossier kandidat, tab dapat berganti-ganti menampilkan kode yang berbeda, dan klik dari Matriks Bukti dapat melompat langsung ke berkas yang relevan di IDE.

---

## 4. Panduan Eksekusi Multi-Agent Tanpa Konflik Git
1. **Agent 1** fokus pada file kerangka (`ContextInspectorPanel.tsx`, `IdeEditorShell.tsx`, `IdeFileTabs.tsx`).
2. **Agent 2** fokus pada komponen render kode murni (`IdeCodeViewer.tsx`, `ForensicCalloutPin.tsx`).
3. **Agent 3** fokus pada lapisan data adapter (`ideCodeAdapter.ts`) lalu menggabungkan semuanya di `WebIdeInspectorView.tsx`.
4. Setiap agen wajib menjalankan commit atomik sesuai *Conventional Commits*:
   - `feat(ui-shell): build ide window frame and file navigation tabs`
   - `feat(code-viewer): implement dark code viewer with ast callout pins`
   - `feat(ide-adapter): integrate dossier code snippets and cross-tab anchors`
