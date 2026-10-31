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
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={13} className="text-[#e2a36b]" />;
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) return <FileText size={13} className="text-[#d9756c]" />;
    return <FileCode size={13} className="text-[#7285d5]" />;
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto bg-[#18191e] px-2 pt-2 border-b border-[#292b36] no-scrollbar">
      {files.map((file) => {
        const isActive = file.id === activeFileId;
        const hasVerifiedCallout = file.callouts.some((c) => c.type === 'VERIFIED');

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelectFile(file.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-mono transition-all border-t border-x cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#1c1d22] text-[#f0f2fb] border-[#363a48] font-medium'
                : 'bg-transparent text-[#767a8c] hover:text-[#c4c7d6] border-transparent hover:bg-[#20222a]'
            }`}
          >
            {getFileIcon(file.fileName)}
            <span>{file.fileName}</span>

            {hasVerifiedCallout && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#8cac91]"
                title="Memuat bukti AST terverifikasi"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
