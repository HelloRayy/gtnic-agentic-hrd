import React, { useState } from 'react';
import { ShieldAlert, Terminal } from 'lucide-react';
import { IdeEditorShell } from './IdeEditorShell.js';
import { IdeCodeViewer } from './IdeCodeViewer.js';
import { generateIdeSnippets } from '../../services/ideCodeAdapter.js';
import type { TechnicalDossier, EvidenceItem, InterviewQuestion } from '@/types/audit.js';

interface WebIdeInspectorViewProps {
  dossier: TechnicalDossier;
  auditedRepos?: string[];
  githubUsername?: string;
  evidenceMatrix?: EvidenceItem[];
  interviewKit?: InterviewQuestion[];
  initialFileId?: string;
}

export const WebIdeInspectorView: React.FC<WebIdeInspectorViewProps> = ({
  dossier,
  auditedRepos = dossier.auditedRepos,
  githubUsername = dossier.candidate.githubUsername,
  initialFileId,
}) => {
  const snippets = generateIdeSnippets(dossier);
  const defaultFileId = initialFileId || snippets[0]?.id || 'manifest';
  const [activeFileId, setActiveFileId] = useState<string>(defaultFileId);

  const activeSnippet =
    snippets.find((s) => s.id === activeFileId) || snippets[0];

  const primaryRepo = auditedRepos[0] || 'repository';

  return (
    <div className="space-y-3.5">
      {/* Role Notice Card for HRD */}
      <div className="p-3 bg-[#f8f9fc] border border-[#e2e6f4] rounded-xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#41518c]">
          <ShieldAlert size={15} className="text-[#6474b4] shrink-0" />
          <span>Mini Forensic IDE (Khusus User / Tech Lead)</span>
        </div>
        <p className="text-[11.5px] text-[#555866] leading-relaxed m-0">
          Inspeksi berkas nyata dan bukti anotasi AST kandidat langsung di sini tanpa perlu git clone lokal.
        </p>
      </div>

      {/* Mini Forensic In-App IDE Shell */}
      {activeSnippet ? (
        <IdeEditorShell
          activeFile={activeSnippet}
          files={snippets}
          onSelectFile={setActiveFileId}
          githubUsername={githubUsername}
          primaryRepo={primaryRepo}
        >
          <IdeCodeViewer
            code={activeSnippet.code}
            language={activeSnippet.language}
            callouts={activeSnippet.callouts}
          />
        </IdeEditorShell>
      ) : (
        <div className="p-6 text-center text-xs text-[#8c8d97] bg-[#1c1d22] rounded-xl border border-[#2b2d38]">
          <Terminal size={18} className="mx-auto mb-2 text-[#7285d5]" />
          <span>Tidak ada berkas snippet kode terdeteksi.</span>
        </div>
      )}
    </div>
  );
};
