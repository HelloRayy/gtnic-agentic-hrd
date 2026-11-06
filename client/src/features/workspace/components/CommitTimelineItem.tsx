import React, { useState } from 'react';
import { Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import type { RepoCommitItem } from '@/types/audit.js';

interface CommitTimelineItemProps {
  commit: RepoCommitItem;
  isLast?: boolean;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} bulan yang lalu`;
  } catch {
    return dateStr;
  }
}

export const CommitTimelineItem: React.FC<CommitTimelineItemProps> = ({ commit, isLast = false }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySha = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(commit.sha);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const shortSha = commit.shortSha || commit.sha.slice(0, 7);
  const relativeTime = formatRelativeTime(commit.date);

  return (
    <div className={`relative flex items-start gap-3.5 py-3.5 px-4.5 hover:bg-[#f6f8fa]/70 transition-colors ${!isLast ? 'border-b border-[#e1e4e8]' : ''}`}>
      {/* Avatar Author dengan Indikator Node Timeline */}
      <div className="relative shrink-0 mt-0.5">
        {commit.authorAvatar ? (
          <img
            src={commit.authorAvatar}
            alt={commit.authorName}
            className="w-6 h-6 rounded-full bg-[#f0eee9] border border-[#d0d7de] object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(commit.authorName)}&background=f0eee9&color=57606a`;
            }}
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#eaeef2] border border-[#d0d7de] flex items-center justify-center text-[10px] font-bold text-[#57606a]">
            {commit.authorName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Konten Pesan Commit & Metadata */}
      <div className="flex-1 min-w-0 pr-2">
        <a
          href={commit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-semibold text-[#1f2328] hover:text-[#0969da] transition-colors line-clamp-2 block leading-snug tracking-tight"
          title={commit.message}
        >
          {commit.message}
        </a>

        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-[#636c76]">
          <span className="font-medium text-[#24292f]">
            {commit.authorLogin ? `@${commit.authorLogin}` : commit.authorName}
          </span>
          <span>·</span>
          <span>{relativeTime}</span>

          {commit.verified && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-[#1a7f37] bg-[#dafbe1] border border-[#4ac26b]/40 cursor-help"
              title="Verified commit author by Git/GPG signature"
            >
              <ShieldCheck size={11} className="text-[#1a7f37]" />
              <span>Verified</span>
            </span>
          )}
        </div>
      </div>

      {/* Aksi Commit: SHA Pill & External Link */}
      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
        <button
          type="button"
          onClick={handleCopySha}
          className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-[#f6f8fa] hover:bg-[#eaeef2] border border-[#d0d7de] text-[#0969da] font-mono text-[11.5px] transition-all cursor-pointer shadow-2xs"
          title="Salin full SHA commit"
        >
          {isCopied ? (
            <>
              <Check size={11} className="text-[#1a7f37]" />
              <span className="text-[#1a7f37] font-sans font-medium text-[11px]">Tersalin</span>
            </>
          ) : (
            <>
              <span>{shortSha}</span>
              <Copy size={11} className="text-[#8c959f] group-hover:text-[#0969da] transition-colors" />
            </>
          )}
        </button>

        <a
          href={commit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-[6px] text-[#8c959f] hover:text-[#0969da] hover:bg-[#eaeef2] transition-colors"
          title="Buka commit ini di GitHub"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
