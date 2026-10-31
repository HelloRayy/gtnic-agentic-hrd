import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Terminal } from 'lucide-react';
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

  return (
    <div className="rounded-xl border border-[#2b2d38] overflow-hidden bg-[#18191e] shadow-xl text-xs space-y-0">
      {/* 1. macOS Style Header Window Controls & Breadcrumbs */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141519] border-b border-[#242630] select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          </div>
          <span className="text-[11px] font-mono text-[#777b8f] truncate max-w-[220px]">
            {activeFile.filePath}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9aa0b8] bg-[#22242c] px-2 py-0.5 rounded border border-[#2f323e]">
            {activeFile.language}
          </span>
        </div>
      </div>

      {/* 2. File Tabs */}
      <IdeFileTabs
        files={files}
        activeFileId={activeFile.id}
        onSelectFile={onSelectFile}
      />

      {/* 3. Editor View Container */}
      <div className="relative">
        {children}
      </div>

      {/* 4. Footer Quick Actions */}
      <div className="flex items-center justify-between p-2.5 bg-[#141519] border-t border-[#242630] text-xs">
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#20222a] hover:bg-[#282a35] text-[#b6bbd2] border border-[#2e313d] transition-colors cursor-pointer text-[11px]"
        >
          {copied ? <Check size={12} className="text-[#8cac91]" /> : <Copy size={12} />}
          <span>{copied ? 'Tersalin' : 'Salin Snippet'}</span>
        </button>

        <a
          href={githubDevUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#7285d5] hover:bg-[#5f74cb] text-white font-medium transition-colors shadow-xs text-[11px]"
        >
          <Terminal size={12} />
          <span>Buka Full di github.dev</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
