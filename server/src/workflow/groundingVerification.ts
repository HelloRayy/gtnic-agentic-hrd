import { findTransferableMatch } from '../core/techTaxonomy.js';
import type { EvidenceItem, RepoAuditEvidence } from '../core/types.js';
import type { TraceStore } from '../memory/traceStore.js';

export function runGroundingVerification(
  evidenceMatrix: EvidenceItem[],
  auditedRepos: RepoAuditEvidence[],
  clarificationPrompts: string[],
  allDeps: string[],
  traceStore: TraceStore
): { correctionCount: number } {
  traceStore.log('PLAN', 'SELF_CORRECTION', 'Executing Grounding Verification Gate across synthesized evidence.');
  let correctionCount = 0;

  for (const item of evidenceMatrix) {
    if (item.status === 'VERIFIED') {
      const claimLower = item.claim.toLowerCase();
      const hasManifestEvidence = allDeps.some((d) => d.includes(claimLower));
      const hasRepoAnchor = item.repoAnchor && auditedRepos.some((r) => r.repoName === item.repoAnchor);
      const hasLanguageOrFileMatch = auditedRepos.some(
        (r) =>
          r.primaryLanguage.toLowerCase().includes(claimLower) ||
          r.fileTreeSample.some((f) => f.toLowerCase().includes(claimLower))
      );

      if (!hasManifestEvidence && !hasRepoAnchor && !hasLanguageOrFileMatch) {
        const trans = findTransferableMatch(item.claim, allDeps);
        if (trans.isTransferable && trans.matchedDep) {
          item.status = 'TRANSFERABLE';
          item.evidenceSummary += ` [Koreksi Mandiri Grounding: Disesuaikan ke TRANSFERABLE karena terdeteksi teknologi serumpun '${trans.matchedDep}']`;
        } else {
          item.status = 'PARTIAL';
          item.evidenceSummary += ' [Koreksi Mandiri Grounding: Diturunkan ke PARTIAL karena tidak ditemukan bukti artefak fisik pada manifest repositori]';
        }
        correctionCount++;
        traceStore.log(
          'REFLECTION',
          'GROUNDING_CORRECTION',
          `Corrected claim '${item.claim}' to '${item.status}' based on deterministic manifest verification.`
        );
      }
    }
  }

  // Verifikasi status kepemilikan dan kloning repositori kandidat
  for (const repo of auditedRepos) {
    if (repo.authorshipStatus === 'UNLINKED_GIT_CONFIG') {
      const prompt = `Klarifikasi Konfigurasi Git (${repo.repoName}): ${repo.authorshipNote}`;
      if (!clarificationPrompts.includes(prompt)) clarificationPrompts.push(prompt);
    } else if (repo.authorshipStatus === 'THIRD_PARTY_OWNED') {
      const prompt = `Klarifikasi Kepemilikan Kode (${repo.repoName}): ${repo.authorshipNote} Tanyakan peran kontribusi spesifik kandidat.`;
      if (!clarificationPrompts.includes(prompt)) clarificationPrompts.push(prompt);
    }
    if (repo.isPotentialClone) {
      const prompt = `Verifikasi Orisinalitas Proyek (${repo.repoName}): Terdapat indikasi proyek kursus/tutorial. Tanyakan bagian arsitektur mana yang dibuat mandiri oleh kandidat.`;
      if (!clarificationPrompts.includes(prompt)) clarificationPrompts.push(prompt);
    }
  }

  return { correctionCount };
}
