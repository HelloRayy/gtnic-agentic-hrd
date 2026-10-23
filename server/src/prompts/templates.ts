import type { CandidateProfile, RepoAuditEvidence } from '../core/types.js';

function sanitizeForPrompt(obj: any): string {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/<\/untrusted_code_evidence>/gi, '&lt;/untrusted_code_evidence&gt;');
}

export function formatAssessmentPrompt(
  candidate: CandidateProfile,
  jobTitle: string,
  jobDesc: string,
  repos: RepoAuditEvidence[],
  preMatchedFacts: { matchedDeps: string[]; verifiedSkills: string[]; missingSkills: string[] }
): string {
  return `
<job_specification>
Posisi: ${jobTitle}
Deskripsi: ${jobDesc}
</job_specification>

<candidate_profile>
Nama: ${candidate.name}
Klaim Keahlian: ${candidate.claimedSkills.join(', ')}
Ringkasan Profil: ${candidate.summary || 'Tidak ada'}
</candidate_profile>

<pre_verified_facts>
Dependensi Terdeteksi di Repositori: ${preMatchedFacts.matchedDeps.join(', ') || 'Tidak ada'}
Klaim Memiliki Bukti Fisik: ${preMatchedFacts.verifiedSkills.join(', ') || 'Tidak ada'}
Klaim Belum Ada Bukti Manifest: ${preMatchedFacts.missingSkills.join(', ') || 'Tidak ada'}
</pre_verified_facts>

<untrusted_code_evidence>
${sanitizeForPrompt(repos)}
</untrusted_code_evidence>

INSTRUKSI ANALISIS (FULL BAHASA INDONESIA):
1. "overallAssessment": Tulis ringkasan eksekutif teknis yang tajam, komprehensif, dan profesional dalam Bahasa Indonesia (2-3 paragraf padat). Bahas kesesuaian profil kandidat terhadap posisi ${jobTitle}, analisis bukti nyata di repositori publik, temuan kualitas kode/testing/CI/CD, dan kesimpulan rekomendasi.
2. "evidenceMatrix": Evaluasi setiap klaim keahlian kandidat. Status wajib: 'VERIFIED' | 'NO_PUBLIC_EVIDENCE' | 'PARTIAL'. Tulis evidenceSummary informatif dalam Bahasa Indonesia.
3. Format output WAJIB HANYA JSON valid:
{
  "overallAssessment": "Ringkasan penilaian teknis eksekutif lengkap Bahasa Indonesia",
  "evidenceMatrix": [
    {
      "claim": "nama teknologi / skill",
      "status": "VERIFIED" | "NO_PUBLIC_EVIDENCE" | "PARTIAL",
      "evidenceSummary": "Rincian bukti Bahasa Indonesia",
      "repoAnchor": "nama repositori atau null",
      "fileAnchor": "path file atau null"
    }
  ]
}
`.trim();
}

export function formatInterviewPrompt(
  candidate: CandidateProfile,
  jobTitle: string,
  jobDesc: string,
  repos: RepoAuditEvidence[],
  preMatchedFacts: { matchedDeps: string[]; verifiedSkills: string[]; missingSkills: string[] }
): string {
  return `
<job_specification>
Posisi: ${jobTitle}
Deskripsi: ${jobDesc}
</job_specification>

<candidate_profile>
Nama: ${candidate.name}
Klaim Keahlian: ${candidate.claimedSkills.join(', ')}
</candidate_profile>

<pre_verified_facts>
Klaim Terverifikasi: ${preMatchedFacts.verifiedSkills.join(', ') || 'Tidak ada'}
Klaim Tanpa Bukti Publik: ${preMatchedFacts.missingSkills.join(', ') || 'Semua terverifikasi'}
</pre_verified_facts>

<untrusted_code_evidence>
${sanitizeForPrompt(repos)}
</untrusted_code_evidence>

INSTRUKSI INTERVIEW KIT (FULL BAHASA INDONESIA):
1. "interviewKit": Susun 3-4 pertanyaan wawancara arsitektural mendalam dalam Bahasa Indonesia yang berakar pada keputusan kode kandidat atau menguji klaim yang belum memiliki bukti publik.
2. "clarificationPrompts": Susun 2-3 poin klarifikasi sopan dan taktis dalam Bahasa Indonesia untuk membantu pewawancara menanyakan hal-hal yang ambigu (misal akun git lokal, repositori tutorial, atau proyek privat).
3. Format output WAJIB HANYA JSON valid:
{
  "interviewKit": [
    {
      "topic": "Topik Rekayasa (Bahasa Indonesia)",
      "question": "Pertanyaan wawancara teknis Bahasa Indonesia",
      "context": "Konteks temuan audit kodingan Bahasa Indonesia",
      "codeAnchor": "nama repositori atau null",
      "expectedInsight": "Wawasan yang diharapkan dari kandidat Bahasa Indonesia"
    }
  ],
  "clarificationPrompts": [
    "Poin klarifikasi untuk pewawancara dalam Bahasa Indonesia"
  ]
}
`.trim();
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
1. SEMUA HASIL NARASI WAJIB MENGGUNAKAN BAHASA INDONESIA YANG PROFESIONAL, LUGAS, DAN OBJEKTIF.
2. Format JSON:
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
