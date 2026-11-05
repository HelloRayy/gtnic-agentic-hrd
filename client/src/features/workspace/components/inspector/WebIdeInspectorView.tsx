import React, { useState } from 'react';
import { ShieldAlert, Terminal } from 'lucide-react';
import { IdeEditorShell } from './IdeEditorShell.js';
import { IdeCodeViewer } from './IdeCodeViewer.js';
import { generateIdeSnippets } from '../../services/ideCodeAdapter.js';
import { fetchRepoFileContent } from '@/services/auditApi.js';
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
  const [liveCodeCache, setLiveCodeCache] = useState<Record<string, string>>({});

  const primaryRepo = auditedRepos[0] || 'repository';
  const activeSnippet = React.useMemo(() => {
    const existing = snippets.find((s) => s.id === activeFileId || s.filePath.endsWith(activeFileId));
    if (existing) return existing;

    const fileName = activeFileId.split('/').pop() || activeFileId;
    let lang: 'typescript' | 'javascript' | 'json' | 'go' | 'python' | 'yaml' | 'sql' = 'typescript';
    if (fileName.endsWith('.json')) lang = 'json';
    else if (fileName.endsWith('.py')) lang = 'python';
    else if (fileName.endsWith('.go')) lang = 'go';
    else if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) lang = 'yaml';
    else if (fileName.endsWith('.sql')) lang = 'sql';
    else if (fileName.endsWith('.js')) lang = 'javascript';

    return {
      id: activeFileId,
      fileName,
      filePath: activeFileId.includes('/') ? activeFileId : `${primaryRepo}/${activeFileId}`,
      language: lang,
      code: `// Berkas: ${fileName}\n// Jalur: ${activeFileId}\n// Memuat isi berkas dari repositori...`,
      callouts: [],
    };
  }, [snippets, activeFileId, primaryRepo]);
  React.useEffect(() => {
    if (!activeSnippet) return;
    if (liveCodeCache[activeSnippet.id]) return;
    if (activeSnippet.code && !activeSnippet.code.startsWith('// Memuat')) return;

    const parts = activeSnippet.filePath.split('/');
    const repo = parts[0];
    const path = parts.slice(1).join('/');

    if (githubUsername && repo && path) {
      fetchRepoFileContent(githubUsername, repo, path)
        .then((res) => {
          if (res.content) {
            setLiveCodeCache((prev) => ({ ...prev, [activeSnippet.id]: res.content }));
          }
        })
        .catch(() => {});
    }
  }, [activeSnippet, githubUsername, liveCodeCache]);

  const displayCode =
    (activeSnippet && liveCodeCache[activeSnippet.id]) || activeSnippet?.code || '';
  return (
    <div className="flex-1 h-full flex flex-col space-y-3 min-h-0">
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
          files={snippets.some((s) => s.id === activeSnippet.id) ? snippets : [activeSnippet, ...snippets]}
          onSelectFile={setActiveFileId}
          githubUsername={githubUsername}
          primaryRepo={primaryRepo}
        >
          <IdeCodeViewer
            code={displayCode}
            language={activeSnippet.language}
            callouts={activeSnippet.callouts}
          />
        </IdeEditorShell>
      ) : (
        <div className="p-6 text-center text-xs text-[#57606a] bg-[#ffffff] rounded-xl border border-[#d0d7de]">
          <Terminal size={18} className="mx-auto mb-2 text-[#7285d5]" />
          <span>Tidak ada berkas snippet kode terdeteksi.</span>
        </div>
      )}
    </div>
  );
};
