# Repository Guidelines & AI Agent Protocol (GTNIC 2026)

> **Mandat Mutlak Seluruh AI Agent**: 
> File ini adalah Single Source of Truth operasional untuk seluruh AI coding agent yang bekerja di repositori ini (3 developer/workstation).
> Sebelum menulis atau memodifikasi kode apa pun, agen wajib mematuhi seluruh invariant di bawah ini demi menjamin konsistensi, zero-drift, dan pencegahan tabrakan git.

---

## 1. Zero-Drift Code Standards (Standar Koding Mutlak)

1. **Hard Cap Panjang File**:
   - Maksimal **250–300 baris** per file. Dilarang keras membuat file komponen/layar monolitik.
   - Pecah selalu widget/komponen besar ke dalam sub-komponen terpisah dengan *single responsibility*.
2. **Pemisahan Lapisan (Separation of Concerns)**:
   - Layer UI murni hanya menangani render tampilan dan binding state.
   - Dilarang menjalankan query database mentah, HTTP request, atau pemanggilan LLM/tool langsung di dalam file UI. Wajib delegasikan ke `services/` atau `controllers/`.
3. **Import Aliasing**:
   - Wajib selalu menggunakan path alias `@/` (misal `@/core/...`, `@/features/...`, `@/services/...`).
   - Dilarang keras menggunakan relative path bertingkat seperti `../../../../`.
4. **Design Tokens & No Hardcode**:
   - Dilarang menulis raw hex color atau styling acak. Gunakan selalu token tema/warna resmi dari sistem desain.
   - Dilarang hardcode kredensial, API key, atau URL base. Gunakan selalu konfigurasi environment variables (`.env`).
5. **Defensive Programming**:
   - Setiap alur interaksi dan fetch data wajib menangani 4 state: **Loading**, **Empty**, **Error**, dan **Success**.

---

## 2. Multi-Agent Git Workflow (Siklus Wajib 3 Orang)

Setiap agen di laptop mana pun wajib mengeksekusi alur 5 langkah ini secara disiplin:

1. **Pre-Task Sync (Wajib Tarik Kode Terbaru)**:
   Sebelum menganalisis atau menulis kode apa pun:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Isolasi Fitur via Branch**:
   Dilarang keras langsung coding di branch `main`. Buat branch baru untuk setiap task:
   ```bash
   git checkout -b <type>/<domain>-<nama-fitur>
   # Contoh: feat/rag-document-parser, fix/auth-token-refresh, feat/dashboard-kpi
   ```
   Tipe yang diizinkan: `feat`, `fix`, `refactor`, `docs`, `chore`.
3. **Pengerjaan Sesuai Domain**:
   Hanya modifikasi file dalam domain fitur yang sedang ditugaskan. Dilarang merapikan/memodifikasi file di luar domain task (cegah efek domino).
4. **Atomic Commit**:
   Gunakan standar *Conventional Commits*:
   ```bash
   git add .
   git commit -m "<type>(<scope>): <deskripsi singkat padat>"
   ```
5. **Sync & Push**:
   ```bash
   git fetch origin main
   git rebase origin/main
   git push origin <nama-branch>
   ```

---

## 3. Protokol Self-Healing & Penanganan Error Otomatis

Jika terjadi error kompilasi, konflik git, atau kegagalan eksekusi, agen dilarang panik atau menebak-nebak:

### A. Penanganan Merge Conflict (Saat Rebase / Pull)
1. Periksa file yang berkonflik: `git status --short`.
2. **Matriks Resolusi**:
   - **File Route / Registry / Dependency**: Lakukan penggabungan (*union*). DILARANG menghapus route atau dependensi yang ditambahkan oleh developer lain.
   - **File Schema / Tipe Data / Kontrak**: Pertahankan definisi yang paling lengkap dan kompatibel ke belakang (*backward compatible*).
   - **File Logika**: Baca riwayat commit (`git log -n 5 <file>`) untuk memahami tujuan perubahan rekan tim sebelum menggabungkan logika.
3. Hapus penanda konflik (`<<<<<<<`, `=======`, `>>>>>>>`), pastikan sintaks valid, lalu jalankan:
   ```bash
   git add <file>
   git rebase --continue
   ```

### B. Penanganan Error Linter & Type-Check
1. **Dilarang Workaround Kotor**: Dilarang menggunakan `any`, `@ts-ignore`, atau membungkam error linter secara paksa.
2. **Maksimal 2 Putaran Perbaikan**:
   - Analisis pesan error asli baris per baris dan perbaiki akar masalahnya (*root cause*).
   - Jika dalam 2 kali percobaan perbaikan error semakin meluas atau buntu:
     **Segera batalkan perubahan kotor** (`git checkout -- <file>`) dan laporkan secara transparan kendala teknisnya ke developer manusia.

---

## 4. Anti-Hallucination & AI Common Sense

1. **Logika Masuk Akal > Sekadar Kode Jalan**:
   Pastikan alur bisnis berjalan dari ujung ke ujung. Jangan puas hanya karena kode tidak menghasilkan syntax error jika alur datanya salah.
2. **Jangan Mengarang API / Fitur Fiktif**:
   Jika kontrak data, endpoint API, atau perilaku fitur belum jelas: **Tanyakan langsung ke pengguna**. Dilarang berhalusinasi membuat fungsi atau asumsi tanpa konfirmasi.
3. **Navigasi Cepat (Zero-MD Overhead)**:
   Untuk navigasi file dalam pengerjaan task rutin, baca HANYA file [`AGENT_MANIFEST.md`](file:///home/rayhan/Windows-D/project/gtnic-project/AGENT_MANIFEST.md) di root. Dilarang membuang token membaca dokumentasi panjang secara berulang-ulang.

---

## 5. AI Agent Evaluation & Production Guardrails (Standar GTNIC 2026)

Untuk memenuhi kriteria penilaian kompetisi GTNIC (Otonomi 25%, Penalaran 15%, Tool Calling 15%, Arsitektur 15%):

1. **Strict Tool-Calling Schema**:
   - Setiap fungsi *tool/action* wajib memiliki skema parameter yang divalidasi ketat (tipe data, required fields).
   - Validasi output tool sebelum diolah kembali oleh reasoning engine (cegah JSON parse failure).
2. **Reasoning Traceability (Chain-of-Thought)**:
   - Sediakan mekanisme logging terstruktur untuk setiap langkah pemikiran agent (*Plan $\rightarrow$ Tool Call $\rightarrow$ Observation $\rightarrow$ Reflection*). Ini wajib agar juri dapat menginspeksi otonomi sistem.
3. **Grounding & Anti-Hallucination Guardrail**:
   - Jawaban dan aksi operasional wajib berbasis *ground truth* (data retrieval dari RAG atau respons API nyata).
   - Dilarang keras mengizinkan agent berspekulasi angka atau fakta penting perusahaan tanpa bukti dokumen.
4. **Autonomous Error Recovery (Graceful Degradation)**:
   - Jika external API atau tool mengalami timeout/failure, agent wajib memiliki logika pemulihan otomatis (retry berbatas atau beralih ke tool alternatif) tanpa merusak sesi pengguna.

