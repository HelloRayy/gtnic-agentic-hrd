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
| **Agent Core & Reasoning** | `server/src/core/types.ts`, `server/src/workflow/pipeline.ts` | `client/src/features/audit/components/DossierTabs.tsx` |
| **Evidence & Fact Matrix** | `server/src/prompts/templates.ts`, `server/src/workflow/pipeline.ts` | `client/src/features/audit/components/EvidenceMatrixTab.tsx` |
| **Investigation Radar** | `server/src/prompts/templates.ts` | `client/src/features/audit/components/InvestigationRadarTab.tsx`, `InvestigationCard.tsx` |
| **Code Inspector (IDE)** | `server/src/tools/implementations/githubAuditorTool.ts` | `client/src/features/audit/components/CodeInspectorTab.tsx` |
| **Tool Calling & Registry** | `server/src/tools/index.ts`, `server/src/tools/registry.ts` | `server/src/tools/implementations/` |
| **Memory & Traceability** | `server/src/memory/traceStore.ts`, `cacheStore.ts` | `client/src/features/audit/components/TraceEventsTab.tsx`, `TraceLog.tsx` |
| **Workspace Integrations** | `server/src/services/googleAuthService.ts`, `googleAuthController.ts` | `client/src/features/integrations/components/HrdIntegrationsModal.tsx`, `client/src/features/audit/components/InterviewActionCard.tsx` |
| **API Transport & Client** | `server/src/api/routes/`, `server/src/api/controllers/` | `client/src/services/auditApi.ts` |

---

## 3. Protokol Eksekusi Cepat (The 3-Step Rule)

1. **Turn 1 (Peta & Aturan)**: Periksa baris domain di tabel atas.
2. **Turn 2 (Target Read)**: Baca file target (Leaf saja jika styling UI, atau Service + Leaf jika mengubah state/data).
3. **Turn 3 (Surgical Edit)**: Modifikasi kode menggunakan `replace_file_content`. Selesai!
