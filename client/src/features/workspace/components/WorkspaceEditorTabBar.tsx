import React from 'react';
import {
  X,
  MessageSquare,
  FileText,
  FileCode,
  FileJson,
  BookOpen,
  Sparkles,
  Calendar,
} from 'lucide-react';
import type { IdeFileSnippet } from '../types.js';

interface WorkspaceEditorTabBarProps {
  openTabs: string[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  snippets: IdeFileSnippet[];
}

export const WorkspaceEditorTabBar: React.FC<WorkspaceEditorTabBarProps> = ({
  openTabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  snippets,
}) => {
  const getTabConfig = (tabId: string) => {
    if (tabId === 'chat') {
      return {
        label: 'deliberasi_copilot.ai',
        icon: <MessageSquare size={13} className="text-[#7285d5]" />,
      };
    }
    if (tabId === 'cv') {
      return {
        label: 'curriculum_vitae.pdf',
        icon: <FileText size={13} className="text-[#8cac91]" />,
      };
    }
    if (tabId === 'matrix') {
      return {
        label: 'matriks_klaim.md',
        icon: <BookOpen size={13} className="text-[#596aa9]" />,
      };
    }
    if (tabId === 'radar') {
      return {
        label: 'radar_kasus.md',
        icon: <Sparkles size={13} className="text-[#d9a441]" />,
      };
    }
    if (tabId === 'action') {
      return {
        label: 'jadwal_interview.gcal',
        icon: <Calendar size={13} className="text-[#8cac91]" />,
      };
    }
    if (tabId.startsWith('code:')) {
      const snipId = tabId.replace('code:', '');
      const snip = snippets.find((s) => s.id === snipId);
      const name = snip ? snip.fileName : 'code.ts';
      const icon = name.endsWith('.json') ? (
        <FileJson size={13} className="text-[#e2a36b]" />
      ) : (
        <FileCode size={13} className="text-[#7285d5]" />
      );
      return { label: name, icon };
    }
    return {
      label: tabId,
      icon: <FileCode size={13} className="text-[#7285d5]" />,
    };
  };

  return (
    <div className="h-10 px-2 bg-[#181920] border-b border-[#292b37] flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 select-none font-sans">
      {openTabs.map((tabId) => {
        const isActive = tabId === activeTabId;
        const config = getTabConfig(tabId);

        return (
          <div
            key={tabId}
            onClick={() => onSelectTab(tabId)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-t-md text-xs font-sans transition-all border-x cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#252836] text-white border-t-2 border-t-[#7285d5] border-[#34374a] font-medium shadow-xs'
                : 'bg-transparent text-[#8e93a7] hover:text-[#f0f2fb] border-transparent hover:bg-[#1f212a]'
            }`}
          >
            {config.icon}
            <span className="truncate max-w-[170px]">{config.label}</span>

            {openTabs.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tabId);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-[#383b4d] rounded p-0.5 text-[#8e93a7] hover:text-white transition-all cursor-pointer ml-1"
                title="Tutup tab"
              >
                <X size={11} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
