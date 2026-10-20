import type { Request, Response } from 'express';
import { auditPipeline } from '../../workflow/pipeline.js';

export async function handleAuditRequest(req: Request, res: Response): Promise<void> {
  try {
    const cvBuffer = req.file?.buffer;
    const { jobTitle, jobDesc, manualGithubUrl, cvText } = req.body;

    if (!cvBuffer && !cvText) {
      res.status(400).json({
        success: false,
        error: 'Please upload a CV (PDF) or provide CV text.',
      });
      return;
    }

    const dossier = await auditPipeline.execute({
      cvBuffer,
      cvText,
      jobTitle: jobTitle || 'Fullstack Engineer',
      jobDesc: jobDesc || 'Building enterprise SaaS with React, TypeScript, and Node.js.',
      manualGithubUrl,
    });

    res.json({
      success: true,
      data: dossier,
    });
  } catch (err: any) {
    console.error('[AuditController] Error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal Agent Execution Error',
    });
  }
}

export async function handleSampleAudit(_req: Request, res: Response): Promise<void> {
  try {
    const sampleCvText = `
John Doe - Senior Fullstack Engineer
Email: john.doe@example.com
GitHub: https://github.com/octocat
Skills: TypeScript, React, Node.js, Docker, PostgreSQL, CI/CD, Microservices
Experience:
5+ years designing distributed web systems, REST APIs, and modern React SPAs.
Implemented automated testing pipelines and containerized deployments.
    `.trim();

    const dossier = await auditPipeline.execute({
      cvText: sampleCvText,
      jobTitle: 'Senior Fullstack Engineer (Enterprise)',
      jobDesc: 'Requires 4+ years React, TypeScript, Node.js, Docker, and CI/CD pipelines.',
      manualGithubUrl: 'https://github.com/octocat',
    });

    res.json({
      success: true,
      data: dossier,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
