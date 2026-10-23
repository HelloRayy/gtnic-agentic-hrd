# AGENT_MANIFEST.md — Single Source of Truth & Fast Router

> **Kompas Cepat AI Agent**: Baca file ini di Turn 1 untuk mengunci konteks domain dan target rute file dalam **1 tool call** (< 60 baris, < 600 token). Dilarang membaca rantai file `.md` lain untuk navigasi rutin.

---

## 1. Aturan Mutlak & Pantangan Arsitektur (Invariants)

- **Hard Cap File**: Maksimal 250 baris (hard cap 300). Wajib pecah ke sub-komponen.
- **Pemisahan Lapisan**: Dilarang panggil LLM/API mentah di file UI. Delegasikan ke `services/` atau `controllers/`.
- **Import Alias**: Wajib pakai alias `@/` (misal `@/core/...`, `@/features/...`).
- **Design Tokens**: Wajib gunakan token tema terpusat (dilarang raw hex color).
- **Git Hygiene**: Wajib `git pull origin main` sebelum task, wajib branch `feat/<domain>-<fitur>`.

---

## 2. Peta Rute Domain-to-File (Parent-to-Leaf Mapping)

> **Protokol Baca Berdasarkan Jenis Task**:
> - **Task Styling / Visual UI**: Baca HANYA file **Leaf Component** (deklarasi props & method render). Jangan buang token membaca service/controller!
> - **Task Alur Data / State / API**: Baca pasangan **[Service / Controller] + [Leaf Component]** secara bersamaan.

| Domain Fitur | Controller / Service / Business Logic | Leaf Component / UI Target |
| :--- | :--- | :--- |
| **Agent Core & Reasoning** | `server/src/core/`, `server/src/workflow/` | `client/src/features/audit/` |
| **Tool Calling & Registry** | `server/src/tools/` | `client/src/features/tools/` |
| **Memory & Traceability** | `server/src/memory/` | `client/src/features/trace/` |
| **Prompts & Synthesis** | `server/src/prompts/`, `server/src/providers/` | `client/src/features/audit/` |
| **API Transport & Routing** | `server/src/api/` | `client/src/services/` |
| **Workspace Integrations** | `server/src/services/googleAuthService.ts` | `client/src/features/audit/components/InterviewActionCard.tsx` |

*(Perbarui tabel ini saat membuat modul atau domain baru).*

---

## 3. Protokol Eksekusi Cepat (The 3-Step Rule)

1. **Turn 1 (Peta & Aturan)**: Periksa baris domain di tabel atas.
2. **Turn 2 (Target Read)**: Baca file target (Leaf saja jika styling UI, atau Service + Leaf jika mengubah state/data).
3. **Turn 3 (Surgical Edit)**: Modifikasi kode menggunakan `replace_file_content`. Selesai!
