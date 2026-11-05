import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  MessageSquare,
  BookOpen,
  Sparkles,
  Calendar,
  Folder,
  FolderOpen,
  ChevronsDownUp,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { generateIdeSnippets } from '../services/ideCodeAdapter.js';
import { RepoFolderTree } from './RepoFolderTree.js';
import type { WorkspaceCandidate } from '../types.js';

interface ForensicExplorerPanelProps {
  candidate: WorkspaceCandidate | null;
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export const ForensicExplorerPanel: React.FC<ForensicExplorerPanelProps> = ({
  candidate,
  activeTabId,
  onSelectTab,
  }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    audit: false,
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapseCounter, setCollapseCounter] = useState(0);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCollapseAll = () => {
    setOpenSections({ audit: false });
    setCollapseCounter((c) => c + 1);
  };

  const dossier = candidate?.dossier;
  const snippets = dossier ? generateIdeSnippets(dossier) : [];
  const q = searchQuery.toLowerCase().trim();

  // Daftar repositori kandidat (setiap repo menjadi 1 folder project utama)
  const auditedRepos = dossier?.auditedRepos && dossier.auditedRepos.length > 0
    ? dossier.auditedRepos
    : ['repository'];

  const repoDetailsMap = new Map<string, string[]>();
  if (dossier?.repoDetails) {
    for (const r of dossier.repoDetails) {
      if (r.repoName && r.fileTreeSample) {
        repoDetailsMap.set(r.repoName, r.fileTreeSample);
      }
    }
  }

  return (
    <aside className="w-[260px] shrink-0 bg-[#fbfaf8] border-l border-[#e5e3dc] text-[#333641] font-sans text-xs select-none flex flex-col h-screen overflow-hidden min-h-0">
      {/* 1. Header Toolbar */}
      <div className="h-10 px-3 bg-[#f5f4ef] border-b border-[#e2dfd7] flex items-center justify-between text-xs shrink-0 select-none">
        <span className="text-[11px] font-sans font-bold tracking-wider text-[#797d8c] uppercase">
          Explorer
        </span>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              if (isSearchOpen) setSearchQuery('');
            }}
            className={`p-1 rounded text-[#797d8c] hover:text-[#242730] hover:bg-[#eae8e1] transition-colors cursor-pointer ${
              isSearchOpen ? 'text-[#242730] bg-[#eae8e1]' : ''
            }`}
            title="Cari berkas (Filter)"
          >
            <Search size={13} />
          </button>

          <button
            type="button"
            onClick={handleCollapseAll}
            className="p-1 rounded text-[#797d8c] hover:text-[#242730] hover:bg-[#eae8e1] transition-colors cursor-pointer"
            title="Tutup semua folder (Collapse All)"
          >
            <ChevronsDownUp size={13} />
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenSections({ audit: true });
              setSearchQuery('');
              setCollapseCounter((c) => c + 1);
            }}
            className="p-1 rounded text-[#797d8c] hover:text-[#242730] hover:bg-[#eae8e1] transition-colors cursor-pointer"
            title="Muat ulang pohon berkas"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* 2. Inline Search Filter */}
      {isSearchOpen && (
        <div className="px-2.5 py-1.5 bg-[#f8f7f4] border-b border-[#e2dfd7] flex items-center gap-1.5 shrink-0">
          <Search size={12} className="text-[#8c909e] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berkas di repositori…"
            className="w-full text-[12px] bg-transparent border-0 outline-none text-[#242730] placeholder-[#8c909e] font-sans min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#8c909e] hover:text-[#242730] cursor-pointer shrink-0"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* 3. Main Tree Container (1 Repo = 1 Folder Root) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-1.5 space-y-1 text-xs">
        {!candidate ? (
          <div className="p-4 text-center text-[#707488] space-y-2 mt-4 font-sans text-xs">
            <p className="m-0">Pilih atau tambahkan kandidat untuk memuat berkas repositori.</p>
          </div>
        ) : (
          <>
            {/* Bagian Utama: Daftar Repositori Kandidat (Setiap Repo = 1 Folder Root) */}
            <div className="space-y-1 min-w-0">
              {auditedRepos.map((repoName, index) => {
                const repoFiles = repoDetailsMap.get(repoName) || [];
                const repoSnippets = snippets.filter(
                  (s) => s.filePath.startsWith(repoName) || s.filePath.includes(repoName)
                );
                return (
                  <RepoFolderTree
                    key={`${repoName}-${collapseCounter}`}
                    repoName={repoName}
                    filePaths={repoFiles}
                    snippets={repoSnippets.length > 0 ? repoSnippets : snippets}
                    activeTabId={activeTabId}
                    onSelectTab={onSelectTab}
                    searchQuery={searchQuery}
                    isAudited={true}
                    defaultOpen={index === 0}
                  />
                );
              })}
            </div>

            {/* Bagian Bawah: Dokumen Pelamar & Laporan Evaluasi Forensik */}
            <div className="pt-2 mt-2 border-t border-[#dedbd3] min-w-0">
              <button
                type="button"
                onClick={() => toggleSection('audit')}
                className="w-full flex items-center justify-between gap-1.5 px-2 py-1 rounded text-[#707488] hover:text-[#242730] hover:bg-[#edece6] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-1.5 truncate min-w-0">
                  {openSections.audit ? <ChevronDown size={12} className="shrink-0" /> : <ChevronRight size={12} className="shrink-0" />}
                  {openSections.audit ? (
                    <FolderOpen size={13} className="text-[#8c8d97] shrink-0" />
                  ) : (
                    <Folder size={13} className="text-[#8c8d97] shrink-0" />
                  )}
                  <span className="truncate">Dokumen & Evaluasi</span>
                </div>
                <span className="text-[10px] text-[#8c909e] font-mono shrink-0">5</span>
              </button>

              {openSections.audit && (
                <div className="border-l border-[#e5e3dc] ml-3.5 space-y-0.5 mt-0.5 min-w-0">
                  {(!q || 'curriculum_vitae.pdf'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('cv')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1 rounded text-left transition-colors cursor-pointer min-w-0 ${
                        activeTabId === 'cv'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6]'
                      }`}
                    >
                      <FileText size={13} className="text-[#8cac91] shrink-0" />
                      <span className="truncate text-xs">curriculum_vitae.pdf</span>
                    </button>
                  )}

                  {(!q || 'deliberasi_copilot.ai'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('chat')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1 rounded text-left transition-colors cursor-pointer min-w-0 ${
                        activeTabId === 'chat'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6]'
                      }`}
                    >
                      <MessageSquare size={13} className="text-[#7285d5] shrink-0" />
                      <span className="truncate text-xs">deliberasi_copilot.ai</span>
                    </button>
                  )}

                  {(!q || 'matriks_klaim.md'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('matrix')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1 rounded text-left transition-colors cursor-pointer min-w-0 ${
                        activeTabId === 'matrix'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6]'
                      }`}
                    >
                      <BookOpen size={13} className="text-[#596aa9] shrink-0" />
                      <span className="truncate text-xs">matriks_klaim.md</span>
                    </button>
                  )}

                  {(!q || 'radar_kasus.md'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('radar')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1 rounded text-left transition-colors cursor-pointer min-w-0 ${
                        activeTabId === 'radar'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6]'
                      }`}
                    >
                      <Sparkles size={13} className="text-[#d9a441] shrink-0" />
                      <span className="truncate text-xs">radar_kasus.md</span>
                    </button>
                  )}

                  {(!q || 'jadwal_interview.gcal'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('action')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1 rounded text-left transition-colors cursor-pointer min-w-0 ${
                        activeTabId === 'action'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6]'
                      }`}
                    >
                      <Calendar size={13} className="text-[#8cac91] shrink-0" />
                      <span className="truncate text-xs">jadwal_interview.gcal</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 4. Explorer Status Footer */}
      <div className="h-6 px-3 bg-[#f5f4ef] border-t border-[#e2dfd7] flex items-center justify-between text-[10.5px] text-[#8c909e] font-mono shrink-0 select-none">
        <span className="truncate">{auditedRepos.length} Repositori</span>
        <span className="truncate text-[#7285d5] font-semibold">AST Ready</span>
      </div>
    </aside>
  );
};
