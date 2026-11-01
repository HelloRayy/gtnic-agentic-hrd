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
    candidate: true,
    repo: true,
    audit: true,
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCollapseAll = () => {
    setOpenSections({
      candidate: false,
      repo: false,
      audit: false,
    });
  };

  const dossier = candidate?.dossier;
  const snippets = dossier ? generateIdeSnippets(dossier) : [];
  const primaryRepo = dossier?.auditedRepos?.[0] || 'repository';


  const q = searchQuery.toLowerCase().trim();

  return (
    <aside className="w-[260px] shrink-0 bg-[#fbfaf8] border-l border-[#e5e3dc] text-[#333641] font-sans text-xs select-none flex flex-col h-screen overflow-hidden">
      {/* 1. Termul Explorer Header (PANEL_HEADER_CLASS) */}
      <div className="h-10 px-3 bg-[#f5f4ef] border-b border-[#e2dfd7] flex items-center justify-between text-xs shrink-0 select-none">
        <span className="text-[11px] font-sans font-bold tracking-wider text-[#797d8c] uppercase">
          Explorer
        </span>

        {/* Termul Style Action Toolbar */}
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
              setOpenSections({ candidate: true, repo: true, audit: true });
              setSearchQuery('');
            }}
            className="p-1 rounded text-[#797d8c] hover:text-[#242730] hover:bg-[#eae8e1] transition-colors cursor-pointer"
            title="Muat ulang pohon berkas"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* 2. Termul Inline Search Field */}
      {isSearchOpen && (
        <div className="px-2.5 py-1.5 bg-[#f8f7f4] border-b border-[#e2dfd7] flex items-center gap-1.5 animate-in fade-in duration-100">
          <Search size={12} className="text-[#8c909e] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berkas forensik…"
            className="w-full text-[12px] bg-transparent border-0 outline-none text-[#242730] placeholder-[#8c909e] font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#8c909e] hover:text-[#242730] cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* 3. File & Artifact Tree Container ala Termul FileTreeNode */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-xs">
        {!candidate ? (
          <div className="p-4 text-center text-[#707488] space-y-2 mt-4 font-sans text-xs">
            <p className="m-0">Pilih atau tambahkan kandidat untuk memuat berkas forensik.</p>
          </div>
        ) : (
          <>
            {/* Section A: Dokumen Pelamar */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('candidate')}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[#6b6f7f] hover:text-[#242730] hover:bg-[#edece6] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
              >
                {openSections.candidate ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {openSections.candidate ? (
                  <FolderOpen size={13} className="text-[#7285d5]" />
                ) : (
                  <Folder size={13} className="text-[#7285d5]" />
                )}
                <span className="truncate">Dokumen Pelamar</span>
              </button>

              {openSections.candidate && (
                <div className="pl-3.5 pr-1 mt-0.5 space-y-0.5 border-l border-[#e5e3dc] ml-3">
                  {(!q || 'curriculum_vitae.pdf'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('cv')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'cv'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#eeebe5]'
                      }`}
                    >
                      <FileText size={13} className="text-[#8cac91] shrink-0" />
                      <span className="truncate">curriculum_vitae.pdf</span>
                    </button>
                  )}

                  {(!q || 'deliberasi_copilot.ai'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('chat')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'chat'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#eeebe5]'
                      }`}
                    >
                      <MessageSquare size={13} className="text-[#7285d5] shrink-0" />
                      <span className="truncate">deliberasi_copilot.ai</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section B: Repositori & Pohon Berkas Kode ala GitHub */}
            <div className="space-y-1">
              <div className="px-2 py-0.5 text-[10px] font-bold text-[#797d8c] uppercase tracking-wider">
                Pohon Berkas GitHub ({dossier?.auditedRepos?.length || 1} Repo)
              </div>

              {dossier?.auditedRepos && dossier.auditedRepos.length > 0 ? (
                dossier.auditedRepos.map((repoName) => (
                  <RepoFolderTree
                    key={repoName}
                    repoName={repoName}
                    snippets={snippets}
                    activeTabId={activeTabId}
                    onSelectTab={onSelectTab}
                    searchQuery={searchQuery}
                    isAudited={true}
                  />
                ))
              ) : (
                <RepoFolderTree
                  repoName={primaryRepo}
                  snippets={snippets}
                  activeTabId={activeTabId}
                  onSelectTab={onSelectTab}
                  searchQuery={searchQuery}
                  isAudited={true}
                />
              )}
            </div>

            {/* Section C: Laporan Evaluasi Forensik */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('audit')}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[#6b6f7f] hover:text-[#242730] hover:bg-[#edece6] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
              >
                {openSections.audit ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {openSections.audit ? (
                  <FolderOpen size={13} className="text-[#d9a441]" />
                ) : (
                  <Folder size={13} className="text-[#d9a441]" />
                )}
                <span className="truncate">Laporan Forensik</span>
              </button>

              {openSections.audit && (
                <div className="pl-3.5 pr-1 mt-0.5 space-y-0.5 border-l border-[#e5e3dc] ml-3">
                  {(!q || 'matriks_klaim.md'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('matrix')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'matrix'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#eeebe5]'
                      }`}
                    >
                      <BookOpen size={13} className="text-[#596aa9] shrink-0" />
                      <span className="truncate">matriks_klaim.md</span>
                    </button>
                  )}

                  {(!q || 'radar_kasus.md'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('radar')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'radar'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#eeebe5]'
                      }`}
                    >
                      <Sparkles size={13} className="text-[#d9a441] shrink-0" />
                      <span className="truncate">radar_kasus.md</span>
                    </button>
                  )}

                  {(!q || 'jadwal_interview.gcal'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('action')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'action'
                          ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
                          : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#eeebe5]'
                      }`}
                    >
                      <Calendar size={13} className="text-[#8cac91] shrink-0" />
                      <span className="truncate">jadwal_interview.gcal</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 4. Termul StatusBar Footer */}
      <footer className="h-6 px-3 bg-[#f5f4ef] border-t border-[#e2dfd7] flex items-center justify-between text-[10px] text-[#797d8c] select-none shrink-0 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2b8a3e]" />
          <span>AST Grounded</span>
        </div>
        <span className="font-sans text-[10px] text-[#8c909e]">termul-tree v1</span>
      </footer>
    </aside>
  );
};
