import { useState, useEffect, useRef } from 'react';
import { CandidateSidebar } from '@/features/workspace/components/CandidateSidebar.js';
import { DeliberationWorkspace } from '@/features/workspace/components/DeliberationWorkspace.js';
import { ContextInspectorPanel } from '@/features/workspace/components/ContextInspectorPanel.js';
import { AddCandidateModal } from '@/features/workspace/components/AddCandidateModal.js';
import { GoogleIntegrationsModal } from '@/features/workspace/components/GoogleIntegrationsModal.js';
import { CandidateApplyPage } from '@/features/workspace/components/CandidateApplyPage.js';
import type { WorkspaceCandidate } from '@/features/workspace/types.js';
import type { TraceEvent, GoogleAuthStatus, TechnicalDossier } from '@/types/audit.js';
import {
  streamAuditExecution,
  sendDeliberationQuestion,
  fetchGoogleAuthStatus,
} from '@/services/auditApi.js';

const STORAGE_KEY = 'talenttrace_candidates_v1';

export default function App() {
  const [candidates, setCandidates] = useState<WorkspaceCandidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: WorkspaceCandidate[] = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed[0].id : null;
    } catch {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState<'workspace' | 'apply'>(() => {
    try {
      if (
        window.location.pathname === '/apply' ||
        window.location.hash === '#/apply'
      ) {
        return 'apply';
      }
    } catch {}
    return 'workspace';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/apply') {
        setViewMode('apply');
      } else if (window.location.hash === '#/workspace' || !window.location.hash) {
        setViewMode('workspace');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
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
    candidates.find((c) => c.id === activeCandidateId) || (candidates.length > 0 ? candidates[0] : null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    } catch (e) {
      console.error('Failed to save candidates', e);
    }
  }, [candidates]);

  useEffect(() => {
    if (candidates.length > 0) {
      if (!activeCandidateId || !candidates.some((c) => c.id === activeCandidateId)) {
        setActiveCandidateId(candidates[0].id);
      }
    } else {
      setActiveCandidateId(null);
    }
  }, [candidates, activeCandidateId]);
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
          const verifiedCount = dossierResult.evidenceMatrix.filter((e) => e.status === 'VERIFIED').length;
          const totalClaims = dossierResult.evidenceMatrix.length || 1;
          const score = Math.round((verifiedCount / totalClaims) * 100);

          let candidateStatus: 'verified' | 'partial' | 'warning' | 'unverified' = 'verified';
          let candidateStatusLabel = 'TERVERIFIKASI';
          if (score < 45) {
            candidateStatus = 'warning';
            candidateStatusLabel = 'PERLU KLARIFIKASI';
          } else if (score < 75) {
            candidateStatus = 'partial';
            candidateStatusLabel = 'SEBAGIAN';
          }

          const newCandidate: WorkspaceCandidate = {
            id: `cand-${Date.now()}`,
            name: dossierResult.candidate.name || tempCandidateName,
            role: dossierResult.jobTitle || tempJobTitle,
            status: candidateStatus,
            statusLabel: candidateStatusLabel,
            stage: 'screening',
            matchScore: score,
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
    if (!activeCandidate || isExecutingRef.current) return;
    isExecutingRef.current = true;
    setIsLoading(true);
    setTraceEvents([]);
    setElapsedSeconds(0);

    const formData = new FormData();
    formData.append('candidateName', activeCandidate.name);
    formData.append('jobTitle', activeCandidate.role);
    formData.append('githubUrl', activeCandidate.githubUrl);
    if (activeCandidate.dossier?.candidate?.summary) {
      formData.append(
        'cvText',
        `${activeCandidate.name}\n${activeCandidate.dossier.candidate.summary}\nSkills: ${activeCandidate.dossier.candidate.claimedSkills.join(', ')}`
      );
    }

    try {
      await streamAuditExecution(formData, false, {
        onProgress: (event) => setTraceEvents((prev) => [...prev, event]),
        onComplete: (dossierResult: TechnicalDossier) => {
          setCandidates((prev) =>
            prev.map((c) =>
              c.id === activeCandidateId
                ? {
                    ...c,
                    dossier: dossierResult,
                    matchScore: Math.round(
                      ((dossierResult.evidenceMatrix.filter((e) => e.status === 'VERIFIED').length) /
                        (dossierResult.evidenceMatrix.length || 1)) *
                        100
                    ),
                    reposCount: dossierResult.auditedRepos.length,
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
    if (!activeCandidate || !messageText.trim() || isDeliberating) return;
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
    if (!activeCandidate) return;
    const firstRepo =
      activeCandidate.dossier.auditedRepos[0] ||
      activeCandidate.githubUrl.replace('https://github.com/', '');
    const cleanRepo = firstRepo.includes('/')
      ? firstRepo
      : `${activeCandidate.dossier.candidate.githubUsername || 'kandidat'}/${firstRepo}`;
    const url = `https://github.dev/${cleanRepo}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClearCandidates = () => {
    if (window.confirm('Hapus seluruh kandidat dari sesi demo ini?')) {
      setCandidates([]);
      setActiveCandidateId(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  const handleMoveCandidateStage = (
    candidateId: string,
    newStage: 'screening' | 'interview' | 'accepted'
  ) => {
    setCandidates((prev) =>
      prev.map((cand) =>
        cand.id === candidateId ? { ...cand, stage: newStage } : cand
      )
    );
  };

  const switchToApply = () => {
    window.location.hash = '#/apply';
    setViewMode('apply');
  };

  const switchToWorkspace = () => {
    window.location.hash = '#/workspace';
    setViewMode('workspace');
  };

  if (viewMode === 'apply') {
    return (
      <CandidateApplyPage
        onSubmit={handleRunAudit}
        onSwitchToWorkspace={switchToWorkspace}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f7f4]">
      {/* Panel 1: Candidate Sidebar & Ingestion Queue */}
      <CandidateSidebar
        candidates={candidates}
        activeCandidateId={activeCandidateId}
        onSelectCandidate={setActiveCandidateId}
        onMoveStage={handleMoveCandidateStage}
        onOpenUploadModal={() => setIsAddModalOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        onClearCandidates={handleClearCandidates}
        onSwitchToApply={switchToApply}
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
        onOpenUploadModal={() => setIsAddModalOpen(true)}
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
