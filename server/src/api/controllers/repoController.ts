import type { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { config } from '../../config/env.js';
import type { RepoCommitItem, ContributionDay } from '../../core/types.js';

const octokit = new Octokit({ auth: config.githubToken || undefined });

export async function handleGetRepoCommits(req: Request, res: Response): Promise<void> {
  try {
    const owner = ((req.query.owner as string) || '').trim();
    const repo = ((req.query.repo as string) || '').trim();

    if (!owner || !repo) {
      res.status(400).json({ success: false, error: 'owner dan repo repositori wajib disertakan.' });
      return;
    }

    try {
      const { data: commits } = await octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 20,
      });

      const commitItems: RepoCommitItem[] = commits.map((c) => {
        const shortSha = c.sha ? c.sha.slice(0, 7) : '';
        const authorLogin = c.author?.login || '';
        const authorName = c.commit.author?.name || authorLogin || owner || 'Developer';
        const authorAvatar = c.author?.avatar_url || `https://github.com/${authorLogin || owner}.png`;
        const date = c.commit.author?.date || new Date().toISOString();
        const commitUrl = c.html_url || `https://github.com/${owner}/${repo}/commit/${c.sha}`;
        const isVerified = Boolean(c.commit.verification?.verified);

        return {
          sha: c.sha,
          shortSha,
          message: c.commit.message,
          authorName,
          authorLogin,
          authorAvatar,
          date,
          url: commitUrl,
          verified: isVerified,
        };
      });

      res.json({
        success: true,
        owner,
        repo,
        commits: commitItems,
      });
      return;
    } catch (githubErr: unknown) {
      const isNotFound = typeof githubErr === 'object' && githubErr !== null && 'status' in githubErr && (githubErr as { status: number }).status === 404;
      const msg = isNotFound ? 'Repositori tidak ditemukan atau bersifat privat.' : 'Tidak dapat memuat commit dari repositori.';
      res.json({
        success: true,
        owner,
        repo,
        commits: [],
        note: msg,
      });
      return;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleGetRepoFileContent(req: Request, res: Response): Promise<void> {
  try {
    const owner = (req.query.owner as string) || '';
    const repo = (req.query.repo as string) || '';
    const filePath = (req.query.path as string) || '';

    if (!owner || !repo || !filePath) {
      res.status(400).json({ success: false, error: 'owner, repo, dan path wajib disertakan.' });
      return;
    }

    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
      });

      if (!Array.isArray(data) && data.type === 'file' && data.content) {
        const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
        res.json({
          success: true,
          content: decoded,
          fileName: data.name,
          filePath: data.path,
          size: data.size,
        });
        return;
      }
    } catch {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
      const rawRes = await fetch(rawUrl);
      if (rawRes.ok) {
        const rawText = await rawRes.text();
        res.json({
          success: true,
          content: rawText,
          fileName: filePath.split('/').pop() || filePath,
          filePath,
        });
        return;
      }
    }

    res.status(404).json({ success: false, error: 'Berkas tidak ditemukan di repositori.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}

export async function handleGetCandidateContributions(req: Request, res: Response): Promise<void> {
  try {
    const raw = ((req.query.username as string) || (req.query.url as string) || '').trim();
    const match = raw.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    const username = match ? match[1] : raw.replace(/^@/, '');

    if (!username) {
      res.status(400).json({ success: false, error: 'Username GitHub wajib disertakan.' });
      return;
    }

    try {
      const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': 'text/html',
        },
      });

      if (response.ok) {
        const html = await response.text();
        const totalMatch = html.match(/([\d,]+)\s+contributions/i);
        const totalContributions = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0;

        const tdRegex = /<td([^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*)>/g;
        let m;
        const days: ContributionDay[] = [];
        while ((m = tdRegex.exec(html)) !== null) {
          const attrs = m[1];
          const dateMatch = attrs.match(/data-date="([^"]+)"/);
          const levelMatch = attrs.match(/data-level="([^"]+)"/);
          const idMatch = attrs.match(/id="([^"]+)"/);

          if (dateMatch) {
            const date = dateMatch[1];
            const level = levelMatch ? (Math.min(4, Math.max(0, parseInt(levelMatch[1], 10))) as 0 | 1 | 2 | 3 | 4) : 0;
            let count = 0;

            if (idMatch) {
              const tipRegex = new RegExp(`for="${idMatch[1]}"[^>]*>([^<]+)<`);
              const tipMatch = html.match(tipRegex);
              if (tipMatch) {
                const countMatch = tipMatch[1].match(/(\d+)\s+contribution/i);
                if (countMatch) count = parseInt(countMatch[1], 10);
              }
            }
            if (count === 0 && level > 0) count = level;
            days.push({ date, level, count });
          }
        }

        if (days.length > 0) {
          days.sort((a, b) => a.date.localeCompare(b.date));
          res.json({
            success: true,
            username,
            totalContributions: totalContributions || days.reduce((acc, d) => acc + d.count, 0),
            days,
          });
          return;
        }
      }
    } catch {}

    // Respon jujur berbasis ketersediaan data aktual (no fake sine-wave generation)
    res.json({
      success: true,
      username,
      totalContributions: 0,
      days: [],
      error: 'Data kontribusi publik tidak tersedia atau akun disetel privat.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
}
