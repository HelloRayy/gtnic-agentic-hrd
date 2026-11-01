import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
} from 'lucide-react';
import type { IdeFileSnippet } from '../types.js';

interface RepoFolderTreeProps {
  repoName: string;
  snippets: IdeFileSnippet[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  searchQuery?: string;
  isAudited?: boolean;
  onTriggerAudit?: (repoName: string) => void;
}

export const RepoFolderTree: React.FC<RepoFolderTreeProps> = ({
  repoName,
  snippets,
  activeTabId,
  onSelectTab,
  searchQuery = '',
  isAudited = true,
  onTriggerAudit,
}) => {
  const [isRepoOpen, setIsRepoOpen] = useState(true);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    src: true,
    services: true,
    components: true,
    '.github': true,
    workflows: true,
  });

  const toggleFolder = (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const getCodeFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={13} className="text-[#e2a36b] shrink-0" />;
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml') || fileName.endsWith('.md')) {
      return <FileText size={13} className="text-[#d9756c] shrink-0" />;
    }
    return <FileCode size={13} className="text-[#58a6ff] shrink-0" />;
  };

  const q = searchQuery.toLowerCase().trim();

  // Group snippets by top folder
  const rootFiles: IdeFileSnippet[] = [];
  const srcFiles: IdeFileSnippet[] = [];
  const githubFiles: IdeFileSnippet[] = [];

  snippets.forEach((snip) => {
    const cleanPath = snip.filePath.replace(new RegExp(`^${repoName}/`), '');
    if (cleanPath.startsWith('src/')) {
      srcFiles.push(snip);
    } else if (cleanPath.startsWith('.github/')) {
      githubFiles.push(snip);
    } else {
      rootFiles.push(snip);
    }
  });

  const renderFileItem = (snip: IdeFileSnippet) => {
    const tabKey = `code:${snip.id}`;
    const isActive = activeTabId === tabKey;
    const isVerified = snip.callouts.some((c) => c.type === 'VERIFIED');
    const fileName = snip.fileName;

    if (q && !fileName.toLowerCase().includes(q)) return null;

    return (
      <button
        key={snip.id}
        type="button"
        onClick={() => onSelectTab(tabKey)}
        className={`w-full flex items-center justify-between gap-1.5 px-2 py-1 rounded text-left transition-all cursor-pointer ${
          isActive
            ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
            : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#eeebe5]'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {getCodeFileIcon(fileName)}
          <span className="truncate text-xs">{fileName}</span>
        </div>
        {isVerified && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#2b8a3e] shrink-0"
            title="Memuat bukti AST terverifikasi"
          />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-0.5">
      {/* Root Repository Folder Header */}
      <button
        type="button"
        onClick={() => setIsRepoOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-1.5 px-2 py-1 rounded text-[#6b6f7f] hover:text-[#242730] hover:bg-[#edece6] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1.5 truncate">
          {isRepoOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {isRepoOpen ? (
            <FolderOpen size={13} className="text-[#8492c6] shrink-0" />
          ) : (
            <Folder size={13} className="text-[#8492c6] shrink-0" />
          )}
          <span className="truncate">{repoName}</span>
        </div>
        {isAudited ? (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#e7f5ea] text-[#2b8a3e] font-mono lowercase">
            ast ready
          </span>
        ) : onTriggerAudit ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onTriggerAudit(repoName);
            }}
            className="text-[9px] px-1.5 py-0.5 rounded bg-[#eeeff7] text-[#596aa9] hover:bg-[#7285d5] hover:text-white transition-colors cursor-pointer"
          >
            + audit
          </span>
        ) : null}
      </button>

      {/* Expanded Tree Content */}
      {isRepoOpen && (
        <div className="pl-3.5 pr-1 space-y-0.5 border-l border-[#e5e3dc] ml-3 text-xs">
          {/* Subfolder: .github/workflows */}
          {githubFiles.length > 0 && (
            <div>
              <button
                type="button"
                onClick={(e) => toggleFolder('.github', e)}
                className="w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[#555866] hover:text-[#242730] hover:bg-[#eeebe5] text-xs cursor-pointer font-medium"
              >
                {openFolders['.github'] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {openFolders['.github'] ? (
                  <FolderOpen size={12} className="text-[#8492c6]" />
                ) : (
                  <Folder size={12} className="text-[#8492c6]" />
                )}
                <span>.github / workflows</span>
              </button>
              {openFolders['.github'] && (
                <div className="pl-3 border-l border-[#e5e3dc] ml-2.5 space-y-0.5 mt-0.5">
                  {githubFiles.map(renderFileItem)}
                </div>
              )}
            </div>
          )}

          {/* Subfolder: src/ */}
          {srcFiles.length > 0 && (
            <div>
              <button
                type="button"
                onClick={(e) => toggleFolder('src', e)}
                className="w-full flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[#555866] hover:text-[#242730] hover:bg-[#eeebe5] text-xs cursor-pointer font-medium"
              >
                {openFolders.src ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {openFolders.src ? (
                  <FolderOpen size={12} className="text-[#8492c6]" />
                ) : (
                  <Folder size={12} className="text-[#8492c6]" />
                )}
                <span>src</span>
              </button>
              {openFolders.src && (
                <div className="pl-3 border-l border-[#e5e3dc] ml-2.5 space-y-0.5 mt-0.5">
                  {srcFiles.map(renderFileItem)}
                </div>
              )}
            </div>
          )}

          {/* Root Level Files (package.json, README.md, docker-compose.yml) */}
          {rootFiles.map(renderFileItem)}
        </div>
      )}
    </div>
  );
};

export default RepoFolderTree;
