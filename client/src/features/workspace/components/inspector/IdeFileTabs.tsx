import React from 'react';
import { FileJson, FileCode, FileText } from 'lucide-react';
import type { IdeFileSnippet } from '../../types.js';

interface IdeFileTabsProps {
  files: IdeFileSnippet[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
}

export const IdeFileTabs: React.FC<IdeFileTabsProps> = ({
  files,
  activeFileId,
  onSelectFile,
}) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto bg-[#f6f8fa] px-2.5 pt-2 border-b border-[#d0d7de] no-scrollbar select-none">
      {files.map((file) => {
        const isActive = file.id === activeFileId;
        const hasVerifiedCallout = file.callouts.some((c) => c.type === 'VERIFIED');

        let fileIcon = <FileCode size={13} className="text-[#0969da]" />;
        if (file.fileName.endsWith('.json')) {
          fileIcon = <FileJson size={13} className="text-[#9a6700]" />;
        } else if (file.fileName.endsWith('.yml') || file.fileName.endsWith('.yaml')) {
          fileIcon = <FileText size={13} className="text-[#cf222e]" />;
        }

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelectFile(file.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-sans transition-all border-x cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#ffffff] text-[#24292f] border-t-2 border-t-[#7285d5] border-[#d0d7de] font-semibold shadow-xs'
                : 'bg-transparent text-[#57606a] hover:text-[#24292f] border-transparent hover:bg-[#eaeef2]'
            }`}
          >
            {fileIcon}
            <span>{file.fileName}</span>

            {hasVerifiedCallout && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]"
                title="Memuat bukti AST terverifikasi"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
