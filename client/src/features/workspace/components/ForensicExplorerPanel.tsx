import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  FileJson,
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

  const getCodeFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={13} className="text-[#e2a36b] shrink-0" />;
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) return <FileText size={13} className="text-[#d9756c] shrink-0" />;
    return <FileCode size={13} className="text-[#58a6ff] shrink-0" />;
  };

  const q = searchQuery.toLowerCase().trim();

  return (
    <aside className="w-[260px] shrink-0 bg-[#16171d] border-l border-[#282a35] text-[#d6d9e8] font-sans text-xs select-none flex flex-col h-screen overflow-hidden">
      {/* 1. Termul Explorer Header (PANEL_HEADER_CLASS) */}
      <div className="h-10 px-3 bg-[#131418] border-b border-[#242630] flex items-center justify-between text-xs shrink-0 select-none">
        <span className="text-[11px] font-sans font-bold tracking-wider text-[#9aa0b8] uppercase">
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
            className={`p-1 rounded text-[#7e8296] hover:text-[#f0f2fc] hover:bg-[#1f212a] transition-colors cursor-pointer ${
              isSearchOpen ? 'text-[#f0f2fc] bg-[#1f212a]' : ''
            }`}
            title="Cari berkas (Filter)"
          >
            <Search size={13} />
          </button>

          <button
            type="button"
            onClick={handleCollapseAll}
            className="p-1 rounded text-[#7e8296] hover:text-[#f0f2fc] hover:bg-[#1f212a] transition-colors cursor-pointer"
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
            className="p-1 rounded text-[#7e8296] hover:text-[#f0f2fc] hover:bg-[#1f212a] transition-colors cursor-pointer"
            title="Muat ulang pohon berkas"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* 2. Termul Inline Search Field */}
      {isSearchOpen && (
        <div className="px-2.5 py-1.5 bg-[#101115] border-b border-[#22242c] flex items-center gap-1.5 animate-in fade-in duration-100">
          <Search size={12} className="text-[#65697d] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berkas forensik…"
            className="w-full text-[12px] bg-transparent border-0 outline-none text-[#d6d9e8] placeholder-[#65697d] font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#65697d] hover:text-[#d6d9e8] cursor-pointer"
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
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[#9aa0b8] hover:text-[#f0f2fc] hover:bg-[#1d1f27] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
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
                <div className="pl-3.5 pr-1 mt-0.5 space-y-0.5 border-l border-[#272935] ml-3">
                  {(!q || 'curriculum_vitae.pdf'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('cv')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'cv'
                          ? 'bg-[#252836] text-[#ffffff] font-medium border-l-2 border-[#7285d5]'
                          : 'text-[#969ab0] hover:text-[#e4e7f5] hover:bg-[#1d1f27]'
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
                          ? 'bg-[#252836] text-[#ffffff] font-medium border-l-2 border-[#7285d5]'
                          : 'text-[#969ab0] hover:text-[#e4e7f5] hover:bg-[#1d1f27]'
                      }`}
                    >
                      <MessageSquare size={13} className="text-[#7285d5] shrink-0" />
                      <span className="truncate">deliberasi_copilot.ai</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section B: Repositori & Kode Sumber */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('repo')}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[#9aa0b8] hover:text-[#f0f2fc] hover:bg-[#1d1f27] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
              >
                {openSections.repo ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {openSections.repo ? (
                  <FolderOpen size={13} className="text-[#8492c6]" />
                ) : (
                  <Folder size={13} className="text-[#8492c6]" />
                )}
                <span className="truncate">{primaryRepo}</span>
              </button>

              {openSections.repo && (
                <div className="pl-3.5 pr-1 mt-0.5 space-y-0.5 border-l border-[#272935] ml-3">
                  {snippets
                    .filter((snip) => !q || snip.fileName.toLowerCase().includes(q))
                    .map((snip) => {
                      const tabKey = `code:${snip.id}`;
                      const isActive = activeTabId === tabKey;
                      const isVerified = snip.callouts.some((c) => c.type === 'VERIFIED');

                      return (
                        <button
                          key={snip.id}
                          type="button"
                          onClick={() => onSelectTab(tabKey)}
                          className={`w-full flex items-center justify-between gap-1.5 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#252836] text-[#ffffff] font-medium border-l-2 border-[#7285d5]'
                              : 'text-[#969ab0] hover:text-[#e4e7f5] hover:bg-[#1d1f27]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {getCodeFileIcon(snip.fileName)}
                            <span className="truncate">{snip.fileName}</span>
                          </div>
                          {isVerified && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shrink-0"
                              title="Memuat bukti AST terverifikasi"
                            />
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Section C: Laporan Evaluasi Forensik */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('audit')}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[#9aa0b8] hover:text-[#f0f2fc] hover:bg-[#1d1f27] font-semibold text-[11px] tracking-wider uppercase transition-colors cursor-pointer"
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
                <div className="pl-3.5 pr-1 mt-0.5 space-y-0.5 border-l border-[#272935] ml-3">
                  {(!q || 'matriks_klaim.md'.includes(q)) && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('matrix')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all cursor-pointer ${
                        activeTabId === 'matrix'
                          ? 'bg-[#252836] text-[#ffffff] font-medium border-l-2 border-[#7285d5]'
                          : 'text-[#969ab0] hover:text-[#e4e7f5] hover:bg-[#1d1f27]'
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
                          ? 'bg-[#252836] text-[#ffffff] font-medium border-l-2 border-[#7285d5]'
                          : 'text-[#969ab0] hover:text-[#e4e7f5] hover:bg-[#1d1f27]'
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
                          ? 'bg-[#252836] text-[#ffffff] font-medium border-l-2 border-[#7285d5]'
                          : 'text-[#969ab0] hover:text-[#e4e7f5] hover:bg-[#1d1f27]'
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
      <footer className="h-6 px-3 bg-[#111216] border-t border-[#22242c] flex items-center justify-between text-[10px] text-[#767a8c] select-none shrink-0 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
          <span>AST Grounded</span>
        </div>
        <span className="font-sans text-[10px] text-[#555866]">termul-tree v1</span>
      </footer>
    </aside>
  );
};
