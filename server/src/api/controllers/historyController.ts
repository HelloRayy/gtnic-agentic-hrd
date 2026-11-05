import type { Request, Response } from 'express';
import { auditRepository } from '../../db/database.js';
import type { TechnicalDossier } from '../../core/types.js';

export async function handleGetHistory(_req: Request, res: Response): Promise<void> {
  try {
    const records = auditRepository.getAuditsSummary();
    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[HistoryController] Failed to fetch history:', msg);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleGetHistoryById(req: Request, res: Response): Promise<void> {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ success: false, error: 'ID audit diperlukan.' });
      return;
    }

    const record = auditRepository.getAuditById(id);
    if (!record) {
      res.status(404).json({ success: false, error: 'Riwayat audit tidak ditemukan.' });
      return;
    }

    res.json({
      success: true,
      data: record.dossier,
      record: {
        id: record.id,
        candidateName: record.candidateName,
        candidateEmail: record.candidateEmail,
        githubUsername: record.githubUsername,
        jobTitle: record.jobTitle,
        overallAssessment: record.overallAssessment,
        executionTimeMs: record.executionTimeMs,
        createdAt: record.createdAt,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[HistoryController] Failed to fetch audit by id:', msg);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleDeleteHistoryById(req: Request, res: Response): Promise<void> {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ success: false, error: 'ID audit diperlukan.' });
      return;
    }

    const deleted = auditRepository.deleteAudit(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Riwayat audit tidak ditemukan atau sudah dihapus.' });
      return;
    }

    res.json({
      success: true,
      message: 'Riwayat audit berhasil dihapus.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[HistoryController] Failed to delete audit:', msg);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleSaveHistoryRecord(req: Request, res: Response): Promise<void> {
  try {
    const { id, candidateName, candidateEmail, githubUsername, jobTitle, overallAssessment, dossier } = req.body;
    if (!dossier || !candidateName) {
      res.status(400).json({ success: false, error: 'Data dossier dan nama kandidat wajib ada.' });
      return;
    }

    const auditId = id || (dossier as TechnicalDossier).id || `audit_${Date.now()}`;
    auditRepository.saveAudit({
      id: auditId,
      candidateName,
      candidateEmail,
      githubUsername,
      jobTitle: jobTitle || (dossier as TechnicalDossier).jobTitle || 'Software Engineer',
      overallAssessment: overallAssessment || (dossier as TechnicalDossier).overallAssessment,
      dossier: dossier as TechnicalDossier,
      executionTimeMs: (dossier as TechnicalDossier).executionTimeMs,
      createdAt: (dossier as TechnicalDossier).createdAt || new Date().toISOString(),
    });

    res.json({
      success: true,
      id: auditId,
      message: 'Riwayat audit berhasil disimpan ke database lokal.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[HistoryController] Failed to save audit record:', msg);
    res.status(500).json({ success: false, error: msg });
  }
}
