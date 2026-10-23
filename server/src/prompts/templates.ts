import type { CandidateProfile, RepoAuditEvidence } from '../core/types.js';

function sanitizeForPrompt(obj: any): string {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/<\/untrusted_code_evidence>/gi, '&lt;/untrusted_code_evidence&gt;');
}

export function formatSynthesisPrompt(
  candidate: CandidateProfile,
  jobTitle: string,
  jobDesc: string,
  repos: RepoAuditEvidence[]
): string {
  return `
<job_specification>
Posisi / Role: ${jobTitle}
Deskripsi Pekerjaan: ${jobDesc}
</job_specification>

<candidate_profile>
Nama: ${candidate.name}
Klaim Keahlian: ${candidate.claimedSkills.join(', ')}
Ringkasan Profil: ${candidate.summary || 'Tidak ada'}
</candidate_profile>

<untrusted_code_evidence>
${sanitizeForPrompt(repos)}
</untrusted_code_evidence>

INSTRUKSI MUTLAK (FULL BAHASA INDONESIA):
1. SEMUA HASIL NARASI WAJIB MENGGUNAKAN BAHASA INDONESIA YANG PROFESIONAL, LUGAS, DAN OBJEKTIF. Dilarang menggunakan bahasa Inggris untuk kolom "overallAssessment", "evidenceSummary", pertanyaan/konteks "interviewKit", dan "clarificationPrompts".
2. "overallAssessment": Tulis ringkasan eksekutif teknis yang komprehensif dalam Bahasa Indonesia (2-3 paragraf padat). Jelaskan kesesuaian profil kandidat dengan kualifikasi posisi yang dilamar, temuan audit fisik di GitHub (kualitas kode, kelengkapan tes/CI/CD), perbandingan klaim vs fakta nyata, dan rekomendasi langkah lanjut bagi tim penilai.
3. Cocokkan setiap klaim keahlian dengan bukti fisik nyata di repositori (manifest dependencies, CI/CD, unit tests, struktur folder, riwayat commit).
4. Status bukti wajib salah satu dari: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL'.
5. "evidenceSummary": Tulis temuan bukti spesifik dalam Bahasa Indonesia (misal: 'Ditemukan dependensi express dan typescript di package.json repositori X', atau 'Tidak ditemukan bukti penggunaan di repositori publik kandidat').
6. "interviewKit": Susun 3-4 pertanyaan wawancara kontekstual dalam Bahasa Indonesia yang berfokus langsung pada keputusan arsitektur dan potongan kode nyata yang ditemukan di repositori kandidat.
7. "clarificationPrompts": Susun 2-3 poin klarifikasi ramah dalam Bahasa Indonesia untuk membantu pewawancara menanyakan hal-hal yang ambigu (seperti perbedaan nama akun git, repositori tutorial, atau proyek privat non-publik).
8. Prinsip Explainable AI: DILARANG memberikan skor persentase atau angka acak.
9. Gunakan null jika tidak ada jangkar repositori atau file.
10. Kembalikan HANYA format JSON valid tanpa tanda kutip markdown pembungkus:
{
  "overallAssessment": "Ringkasan penilaian teknis eksekutif lengkap dalam Bahasa Indonesia",
  "evidenceMatrix": [
    {
      "claim": "nama keahlian / teknologi",
      "status": "VERIFIED" | "NO_PUBLIC_EVIDENCE" | "PARTIAL",
      "evidenceSummary": "Rincian bukti dalam Bahasa Indonesia",
      "repoAnchor": "nama repositori atau null",
      "fileAnchor": "path file atau null"
    }
  ],
  "interviewKit": [
    {
      "topic": "Topik Rekayasa (Bahasa Indonesia)",
      "question": "Pertanyaan wawancara teknis dalam Bahasa Indonesia",
      "context": "Konteks temuan kodingan dalam Bahasa Indonesia",
      "codeAnchor": "nama repositori atau null",
      "expectedInsight": "Wawasan yang diharapkan dari jawaban kandidat dalam Bahasa Indonesia"
    }
  ],
  "clarificationPrompts": [
    "Poin klarifikasi untuk pewawancara dalam Bahasa Indonesia"
  ]
}
`.trim();
}
