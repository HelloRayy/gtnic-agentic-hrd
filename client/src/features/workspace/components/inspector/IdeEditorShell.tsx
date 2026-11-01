import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Terminal, FileCode } from 'lucide-react';
import { IdeFileTabs } from './IdeFileTabs.js';
import type { IdeFileSnippet } from '../../types.js';

interface IdeEditorShellProps {
  activeFile: IdeFileSnippet;
  files: IdeFileSnippet[];
  onSelectFile: (fileId: string) => void;
  githubUsername?: string;
  primaryRepo?: string;
  children: React.ReactNode;
}

export const IdeEditorShell: React.FC<IdeEditorShellProps> = ({
  activeFile,
  files,
  onSelectFile,
  githubUsername = 'kandidat',
  primaryRepo = 'repo',
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanRepo = primaryRepo.includes('/') ? primaryRepo : `${githubUsername}/${primaryRepo}`;
  const githubDevUrl = `https://github.dev/${cleanRepo}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const verifiedCount = activeFile.callouts.filter((c) => c.type === 'VERIFIED').length;

  return (
    <div className="rounded-xl border border-[#d0d7de] overflow-hidden bg-[#ffffff] shadow-xs text-xs space-y-0 flex-1 h-full flex flex-col min-h-0">
      {/* 1. File Tabs ala GitHub PR Files Changed */}
      <IdeFileTabs
        files={files}
        activeFileId={activeFile.id}
        onSelectFile={onSelectFile}
      />

      {/* 2. GitHub Diff File Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#f6f8fa] border-b border-[#d0d7de] select-none text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode size={14} className="text-[#57606a] shrink-0" />
          <span className="text-[12px] font-mono font-semibold text-[#24292f] truncate">
            {activeFile.filePath}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {verifiedCount > 0 && (
            <span className="text-[10px] font-mono text-[#1a7f37] bg-[#dafbe1] border border-[#4ac26b]/40 px-2 py-0.5 rounded-full font-medium">
              +{verifiedCount} verified AST
            </span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#57606a] bg-[#eaeef2] px-2 py-0.5 rounded border border-[#d0d7de]">
            {activeFile.language}
          </span>
        </div>
      </div>

      {/* 3. Editor View Container with GitHub Review Diff */}
      <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
        {children}
      </div>

      {/* 4. GitHub Style Action Footer */}
      <div className="flex items-center justify-between p-2.5 bg-[#f6f8fa] border-t border-[#d0d7de] text-xs">
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ffffff] hover:bg-[#eaeef2] text-[#24292f] border border-[#d0d7de] transition-colors cursor-pointer text-[11px] font-medium"
        >
          {copied ? <Check size={12} className="text-[#1a7f37]" /> : <Copy size={12} />}
          <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
        </button>

        <a
          href={githubDevUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2da44e] hover:bg-[#2c974b] text-white font-medium transition-colors shadow-xs text-[11px]"
        >
          <Terminal size={12} />
          <span>Buka di github.dev</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
