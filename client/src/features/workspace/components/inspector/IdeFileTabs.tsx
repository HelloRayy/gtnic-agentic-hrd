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
    <div className="flex items-center gap-1 overflow-x-auto bg-[#010409] px-2.5 pt-2 border-b border-[#30363d] no-scrollbar select-none">
      {files.map((file) => {
        const isActive = file.id === activeFileId;
        const hasVerifiedCallout = file.callouts.some((c) => c.type === 'VERIFIED');

        let fileIcon = <FileCode size={13} className="text-[#58a6ff]" />;
        if (file.fileName.endsWith('.json')) {
          fileIcon = <FileJson size={13} className="text-[#d29922]" />;
        } else if (file.fileName.endsWith('.yml') || file.fileName.endsWith('.yaml')) {
          fileIcon = <FileText size={13} className="text-[#f85149]" />;
        }

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelectFile(file.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-all border-t border-x cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#0d1117] text-[#f0f6fc] border-[#30363d] font-semibold shadow-xs'
                : 'bg-transparent text-[#7d8590] hover:text-[#c9d1d9] border-transparent hover:bg-[#161b22]'
            }`}
          >
            {fileIcon}
            <span>{file.fileName}</span>

            {hasVerifiedCallout && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"
                title="Memuat bukti AST terverifikasi"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
