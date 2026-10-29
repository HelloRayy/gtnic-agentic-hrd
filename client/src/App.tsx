import { useState, useEffect, useRef } from 'react';
import { CandidateSidebar } from '@/features/workspace/components/CandidateSidebar.js';
import { DeliberationWorkspace } from '@/features/workspace/components/DeliberationWorkspace.js';
import { ContextInspectorPanel } from '@/features/workspace/components/ContextInspectorPanel.js';
import { AddCandidateModal } from '@/features/workspace/components/AddCandidateModal.js';
import { GoogleIntegrationsModal } from '@/features/workspace/components/GoogleIntegrationsModal.js';
import { PRESET_CANDIDATES } from '@/features/workspace/presetCandidates.js';
import type { WorkspaceCandidate } from '@/features/workspace/types.js';
import type { TraceEvent, GoogleAuthStatus, TechnicalDossier } from '@/types/audit.js';
import {
  streamAuditExecution,
  sendDeliberationQuestion,
  fetchGoogleAuthStatus,
} from '@/services/auditApi.js';

export default function App() {
  const [candidates, setCandidates] = useState<WorkspaceCandidate[]>(PRESET_CANDIDATES);
  const [activeCandidateId, setActiveCandidateId] = useState<string>(PRESET_CANDIDATES[0].id);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<GoogleAuthStatus | null>(null);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isExecutingRef = useRef(false);

  const activeCandidate =
    candidates.find((c) => c.id === activeCandidateId) || candidates[0];

  useEffect(() => {
    fetchGoogleAuthStatus().then(setGoogleStatus);
  }, []);

  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } else {
      clearInterval(timerRef.current as number);
      timerRef.current = null;
    }
    return () => {
      clearInterval(timerRef.current as number);
    };
  }, [isLoading]);

  const handleRunAudit = async (formData: FormData) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    setIsLoading(true);
    setTraceEvents([]);
    setElapsedSeconds(0);

    const tempCandidateName =
      (formData.get('candidateName') as string) || 'Kandidat Baru';
    const tempJobTitle =
      (formData.get('jobTitle') as string) || 'Senior Software Engineer';
    const tempGithub = (formData.get('githubUrl') as string) || '';

    try {
      await streamAuditExecution(formData, false, {
        onProgress: (event) => setTraceEvents((prev) => [...prev, event]),
        onComplete: (dossierResult: TechnicalDossier) => {
          const newCandidate: WorkspaceCandidate = {
            id: `cand-${Date.now()}`,
            name: dossierResult.candidate.name || tempCandidateName,
            role: dossierResult.jobTitle || tempJobTitle,
            status: 'verified',
            statusLabel: 'TERVERIFIKASI',
            matchScore: Math.floor(80 + Math.random() * 18),
            avatarSeed: (dossierResult.candidate.name || tempCandidateName)
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase(),
            githubUrl: dossierResult.candidate.githubUrl || tempGithub,
            reposCount: dossierResult.auditedRepos.length,
            dossier: dossierResult,
            chatHistory: [
              {
                role: 'assistant',
                content: `Audit forensik selesai untuk ${dossierResult.candidate.name}. ${dossierResult.overallAssessment}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };

          setCandidates((prev) => [newCandidate, ...prev]);
          setActiveCandidateId(newCandidate.id);
          setIsLoading(false);
          isExecutingRef.current = false;
        },
        onError: (err) => {
          console.error('Audit execution error:', err);
          setIsLoading(false);
          isExecutingRef.current = false;
        },
      });
    } catch (err: unknown) {
      console.error('Audit submission error:', err);
      setIsLoading(false);
      isExecutingRef.current = false;
    }
  };

  const handleReaudit = async () => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    setIsLoading(true);
    setTraceEvents([]);
    setElapsedSeconds(0);

    try {
      await streamAuditExecution(null, true, {
        onProgress: (event) => setTraceEvents((prev) => [...prev, event]),
        onComplete: (dossierResult: TechnicalDossier) => {
          setCandidates((prev) =>
            prev.map((c) =>
              c.id === activeCandidateId
                ? {
                    ...c,
                    dossier: {
                      ...dossierResult,
                      candidate: {
                        ...dossierResult.candidate,
                        name: c.name,
                      },
                    },
                  }
                : c
            )
          );
          setIsLoading(false);
          isExecutingRef.current = false;
        },
        onError: () => {
          setIsLoading(false);
          isExecutingRef.current = false;
        },
      });
    } catch {
      setIsLoading(false);
      isExecutingRef.current = false;
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isDeliberating) return;

    const userTimestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage = {
      role: 'user' as const,
      content: messageText,
      timestamp: userTimestamp,
    };

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === activeCandidateId
          ? { ...c, chatHistory: [...c.chatHistory, userMessage] }
          : c
      )
    );

    setIsDeliberating(true);

    try {
      const res = await sendDeliberationQuestion(
        activeCandidate.dossier,
        messageText
      );
      const agentTimestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const agentMessage = {
        role: 'assistant' as const,
        content: res.answer,
        timestamp: agentTimestamp,
        anchors: res.anchors,
      };

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === activeCandidateId
            ? { ...c, chatHistory: [...c.chatHistory, agentMessage] }
            : c
        )
      );
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : 'Gagal memproses deliberasi AI.';
      const errorMessage = {
        role: 'assistant' as const,
        content: `Maaf, terjadi kendala komunikasi dengan router model: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === activeCandidateId
            ? { ...c, chatHistory: [...c.chatHistory, errorMessage] }
            : c
        )
      );
    } finally {
      setIsDeliberating(false);
    }
  };

  const handleOpenWebIde = () => {
    const firstRepo =
      activeCandidate.dossier.auditedRepos[0] ||
      activeCandidate.githubUrl.replace('https://github.com/', '');
    const cleanRepo = firstRepo.includes('/')
      ? firstRepo
      : `${activeCandidate.dossier.candidate.githubUsername || 'kandidat'}/${firstRepo}`;
    const url = `https://github.dev/${cleanRepo}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f7f4]">
      {/* Panel 1: Candidate Sidebar & Ingestion Queue */}
      <CandidateSidebar
        candidates={candidates}
        activeCandidateId={activeCandidateId}
        onSelectCandidate={setActiveCandidateId}
        onOpenUploadModal={() => setIsAddModalOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        googleStatus={googleStatus}
      />

      {/* Panel 2: Center Workspace & Deliberation Hub */}
      <DeliberationWorkspace
        candidate={activeCandidate}
        isLoading={isLoading}
        isDeliberating={isDeliberating}
        traceEvents={traceEvents}
        elapsedSeconds={elapsedSeconds}
        onReaudit={handleReaudit}
        onSendMessage={handleSendMessage}
        onOpenWebIde={handleOpenWebIde}
      />

      {/* Panel 3: Right Inspector Panel / Forensic Dossier */}
      <ContextInspectorPanel
        candidate={activeCandidate}
        googleStatus={googleStatus}
      />

      {/* Dialog Modals */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleRunAudit}
        isLoading={isLoading}
      />

      <GoogleIntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
        onStatusChange={setGoogleStatus}
      />
    </div>
  );
}
