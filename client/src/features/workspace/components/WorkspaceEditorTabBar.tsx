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
    <div className="h-9 px-2 bg-[#f0eee9] border-b border-[#e2dfd8] flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 select-none">
      {openTabs.map((tabId) => {
        const isActive = tabId === activeTabId;
        const config = getTabConfig(tabId);

        return (
          <div
            key={tabId}
            onClick={() => onSelectTab(tabId)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-all border-t border-x cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#ffffff] text-[#242730] border-[#dedcd6] font-semibold shadow-xs'
                : 'bg-transparent text-[#707488] hover:text-[#242730] border-transparent hover:bg-[#e7e5df]'
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
                className="opacity-0 group-hover:opacity-100 hover:bg-[#e2dfd8] rounded p-0.5 text-[#8c8d97] hover:text-[#333641] transition-opacity cursor-pointer ml-1"
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
