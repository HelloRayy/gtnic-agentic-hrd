import React, { useState, useEffect, useCallback } from 'react';
import { GitCommit, GitBranch, RotateCw, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CommitTimelineItem } from './CommitTimelineItem.js';
import { fetchRepoCommits } from '@/services/auditApi.js';
import type { RepoAuditEvidence, RepoCommitItem } from '@/types/audit.js';

interface RepoCommitHistoryCardProps {
  auditedRepos: string[];
  repoDetails?: RepoAuditEvidence[];
  candidateName: string;
  githubUsername?: string;
  selectedRepo?: string;
  onSelectRepo?: (repo: string) => void;
  onInspectCode?: () => void;
}

export const RepoCommitHistoryCard: React.FC<RepoCommitHistoryCardProps> = ({
  auditedRepos,
  repoDetails = [],
  githubUsername = '',
  selectedRepo,
  onSelectRepo,
}) => {
  const initialRepo = selectedRepo || (auditedRepos.length > 0 ? auditedRepos[0] : '');
  const [currentRepo, setCurrentRepo] = useState<string>(initialRepo);
  const [commits, setCommits] = useState<RepoCommitItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (selectedRepo && selectedRepo !== currentRepo) {
      setCurrentRepo(selectedRepo);
    }
  }, [selectedRepo]);

  const loadCommits = useCallback(async (repoName: string, forceFetch = false) => {
    if (!repoName) return;
    setError(null);

    const detail = repoDetails.find((r) => r.repoName === repoName);
    if (!forceFetch && detail?.commitHistory && detail.commitHistory.length > 0) {
      setCommits(detail.commitHistory);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const owner = repoName.includes('/') ? repoName.split('/')[0] : (githubUsername || 'kandidat');
    const cleanRepo = repoName.includes('/') ? repoName.split('/')[1] : repoName;

    try {
      const data = await fetchRepoCommits(owner, cleanRepo);
      setCommits(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil riwayat commit repositori.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [repoDetails, githubUsername]);

  useEffect(() => {
    if (currentRepo) {
      loadCommits(currentRepo);
    }
  }, [currentRepo, loadCommits]);

  const handleSelectTab = (repo: string) => {
    setCurrentRepo(repo);
    if (onSelectRepo) onSelectRepo(repo);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    loadCommits(currentRepo, true);
  };

  if (!auditedRepos || auditedRepos.length === 0) {
    return null;
  }

  const owner = currentRepo.includes('/') ? currentRepo.split('/')[0] : (githubUsername || 'kandidat');
  const cleanRepo = currentRepo.includes('/') ? currentRepo.split('/')[1] : currentRepo;
  const repoGithubUrl = `https://github.com/${owner}/${cleanRepo}/commits`;
  const visibleCommits = showAll ? commits : commits.slice(0, 5);

  return (
    <div className="bg-white rounded-[14px] border border-[#d0d7de] shadow-[0_1px_3px_rgba(31,35,40,0.04)] overflow-hidden mt-3 transition-all">
      {/* 1. GitHub Style Header Card */}
      <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-[6px] bg-[#eef2f6] border border-[#d0d7de] flex items-center justify-center text-[#57606a] shrink-0">
            <GitCommit size={14} className="text-[#0969da]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-bold text-[#1f2328] tracking-tight">
                Riwayat Commit Publik (GitHub)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#57606a] bg-white border border-[#d0d7de] px-2 py-0.5 rounded-full font-medium">
                <GitBranch size={10} className="text-[#57606a]" />
                <span>main</span>
              </span>
              {commits.length > 0 && !isLoading && (
                <span className="text-[11px] font-semibold text-[#0969da] bg-[#ddf4ff] border border-[#54aeff]/40 px-2 py-0.5 rounded-full">
                  {commits.length} Commit Terdeteksi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Refresh, External, Collapse */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-[6px] text-[#57606a] hover:text-[#0969da] hover:bg-[#eaedf0] transition-colors cursor-pointer disabled:opacity-50"
            title="Muat ulang commit dari GitHub"
          >
            <RotateCw size={13} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <a
            href={repoGithubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0969da] hover:underline px-2 py-1 rounded-[6px] hover:bg-[#eaedf0] transition-colors"
            title="Buka seluruh riwayat commit di GitHub"
          >
            <span>GitHub</span>
            <ExternalLink size={11} />
          </a>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-[6px] text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaedf0] transition-colors cursor-pointer"
            title={isCollapsed ? 'Tampilkan commit' : 'Sembunyikan commit'}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 2. Repository Selector Pills (Jika ada lebih dari 1 repositori) */}
          {auditedRepos.length > 1 && (
            <div className="px-4 py-2 border-b border-[#eaeef2] bg-[#fafbfc] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#636c76] shrink-0 mr-1">
                Pilih Repo:
              </span>
              {auditedRepos.map((repo) => {
                const isActive = repo === currentRepo;
                const repoLabel = repo.includes('/') ? repo.split('/')[1] : repo;
                return (
                  <button
                    key={repo}
                    type="button"
                    onClick={() => handleSelectTab(repo)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[6px] transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#0969da] text-white shadow-2xs font-bold'
                        : 'bg-white hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de]'
                    }`}
                  >
                    <GitBranch size={11} className={isActive ? 'text-white' : 'text-[#57606a]'} />
                    <span>{repoLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. States: Loading / Empty / Error / Commit List */}
          <div className="divide-y divide-[#eaeef2]">
            {isLoading && (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-start gap-3 animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-[#eaedf0] shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-[#eaedf0] rounded w-3/4" />
                      <div className="h-2.5 bg-[#f0f3f6] rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="p-4 flex items-center justify-between gap-3 bg-[#fff8f8] text-xs">
                <div className="flex items-center gap-2 text-[#cf222e]">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => loadCommits(currentRepo, true)}
                  className="px-2.5 py-1 bg-white border border-[#d0d7de] rounded-[6px] text-[#24292f] hover:bg-[#f6f8fa] font-medium cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {!isLoading && !error && commits.length === 0 && (
              <div className="py-7 px-4 text-center">
                <GitCommit size={22} className="mx-auto text-[#8c959f] mb-1.5" />
                <p className="text-xs text-[#57606a] font-medium m-0">
                  Tidak ada riwayat commit terdeteksi untuk repositori ini.
                </p>
              </div>
            )}

            {!isLoading && !error && commits.length > 0 && (
              <div>
                {visibleCommits.map((commit, idx) => (
                  <CommitTimelineItem
                    key={commit.sha || idx}
                    commit={commit}
                    isLast={idx === visibleCommits.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. Footer Card: Expand / Collapse Rows */}
          {!isLoading && !error && commits.length > 5 && (
            <div className="bg-[#fafbfc] border-t border-[#d0d7de] px-4 py-2 flex items-center justify-between text-xs text-[#57606a]">
              <span className="text-[11.5px]">
                Menampilkan {visibleCommits.length} dari {commits.length} commit terbaru
              </span>
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="font-semibold text-[#0969da] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>{showAll ? 'Perpendek Tampilan' : `Tampilkan ${commits.length - 5} Commit Lagi`}</span>
                {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
