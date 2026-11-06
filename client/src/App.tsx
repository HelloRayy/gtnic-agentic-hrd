import { useState, useEffect, useRef } from 'react';
import { Columns } from 'lucide-react';
import { BenchmarkInspectorPanel } from '@/features/workspace/components/benchmark/BenchmarkInspectorPanel.js';
import { CandidateSidebar } from '@/features/workspace/components/CandidateSidebar.js';
import { DeliberationWorkspace } from '@/features/workspace/components/DeliberationWorkspace.js';
import { ForensicExplorerPanel } from '@/features/workspace/components/ForensicExplorerPanel.js';
import { AddCandidateModal } from '@/features/workspace/components/AddCandidateModal.js';
import { GoogleIntegrationsModal } from '@/features/workspace/components/GoogleIntegrationsModal.js';
import { CandidateApplyPage } from '@/features/workspace/components/CandidateApplyPage.js';
import { ManageJobsModal } from '@/features/workspace/components/ManageJobsModal.js';
import { getStoredJobs, type RecruitmentPreset } from '@/features/workspace/demoPresets.js';
import type { WorkspaceCandidate } from '@/features/workspace/types.js';
import type { TraceEvent, GoogleAuthStatus, TechnicalDossier, DeliberationMessage } from '@/types/audit.js';
import {
  streamAuditExecution,
  streamDeliberationQuestion,
  fetchGoogleAuthStatus,
  fetchAuditHistory,
  fetchAuditById,
  deleteAuditRecord,
  sendBenchmarkDeliberation,
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

  const [jobs, setJobs] = useState<RecruitmentPreset[]>(() => getStoredJobs());
  const [isManageJobsOpen, setIsManageJobsOpen] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>('chat');
  const [openWorkspaceTabs, setOpenWorkspaceTabs] = useState<string[]>(['chat', 'cv']);
  const handleSelectWorkspaceTab = (tabId: string) => {
    if (tabId === 'chat') {
      setActiveWorkspaceTab('chat');
      return;
    }
    setOpenWorkspaceTabs((prev) => {
      const base = prev.length === 0 ? ['chat'] : prev;
      return base.includes(tabId) ? base : [...base, tabId];
    });
    setActiveWorkspaceTab(tabId);
  };

  const handleCloseWorkspaceTab = (tabId: string) => {
    setOpenWorkspaceTabs((prev) => {
      const nextTabs = prev.filter((t) => t !== tabId);
      if (nextTabs.length === 0 || (nextTabs.length === 1 && nextTabs[0] === 'chat')) {
        setActiveWorkspaceTab('chat');
        return [];
      }
      if (activeWorkspaceTab === tabId) {
        setActiveWorkspaceTab(nextTabs[nextTabs.length - 1]);
      }
      return nextTabs;
    });
  };
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
  const [benchmarkSlotAId, setBenchmarkSlotAId] = useState<string | null>(null);
  const [benchmarkSlotBId, setBenchmarkSlotBId] = useState<string | null>(null);
  const [benchmarkMessages, setBenchmarkMessages] = useState<DeliberationMessage[]>([]);
  const [isBenchmarkDeliberating, setIsBenchmarkDeliberating] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tt_sidebar_width');
      return saved ? parseInt(saved, 10) : 300;
    } catch {
      return 300;
    }
  });

  const [rightPanelWidth, setRightPanelWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tt_right_panel_width');
      return saved ? parseInt(saved, 10) : 280;
    } catch {
      return 280;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tt_sidebar_width', sidebarWidth.toString());
    } catch {}
  }, [sidebarWidth]);

  useEffect(() => {
    try {
      localStorage.setItem('tt_right_panel_width', rightPanelWidth.toString());
    } catch {}
  }, [rightPanelWidth]);

  const handleStartResizeLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(220, Math.min(520, moveEvent.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleStartResizeRight = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(240, Math.min(550, window.innerWidth - moveEvent.clientX));
      setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const benchmarkCandidateA = candidates.find((c) => c.id === benchmarkSlotAId) || null;
  const benchmarkCandidateB = candidates.find((c) => c.id === benchmarkSlotBId) || null;

  const handleOpenBenchmark = () => {
    setBenchmarkSlotAId(null);
    setBenchmarkSlotBId(null);
    setBenchmarkMessages([]);
    handleSelectWorkspaceTab('benchmark');
  };

  const handleSelectBenchmarkSlotA = (id: string | null) => {
    setBenchmarkSlotAId(id);
    setBenchmarkMessages([]);
  };

  const handleSelectBenchmarkSlotB = (id: string | null) => {
    setBenchmarkSlotBId(id);
    setBenchmarkMessages([]);
  };

  const handleSendBenchmarkMessage = async (question: string) => {
    if (!benchmarkCandidateA || !benchmarkCandidateB || isBenchmarkDeliberating || !question.trim()) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: DeliberationMessage = {
      role: 'user',
      content: question,
      timestamp: userTimestamp,
    };

    setBenchmarkMessages((prev) => [...prev, userMsg]);
    setIsBenchmarkDeliberating(true);

    try {
      const res = await sendBenchmarkDeliberation(
        {
          name: benchmarkCandidateA.name,
          role: benchmarkCandidateA.role,
          claimedSkills: benchmarkCandidateA.dossier.candidate.claimedSkills,
          dossier: benchmarkCandidateA.dossier,
        },
        {
          name: benchmarkCandidateB.name,
          role: benchmarkCandidateB.role,
          claimedSkills: benchmarkCandidateB.dossier.candidate.claimedSkills,
          dossier: benchmarkCandidateB.dossier,
        },
        question
      );

      const agentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const agentMsg: DeliberationMessage = {
        role: 'assistant',
        content: res.answer,
        timestamp: agentTimestamp,
        anchors: res.anchors,
      };

      setBenchmarkMessages((prev) => [...prev, agentMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Gagal memproses komparasi.';
      const errorMsg: DeliberationMessage = {
        role: 'assistant',
        content: `Terjadi kendala saat menganalisis kedua kandidat: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBenchmarkMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsBenchmarkDeliberating(false);
    }
  };

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

    // Sinkronisasi data riwayat kandidat dari database SQLite backend
    const syncDatabaseHistory = async () => {
      try {
        const historyList = await fetchAuditHistory();
        if (historyList.length > 0) {
          const loaded: WorkspaceCandidate[] = [];
          for (const item of historyList.slice(0, 10)) {
            try {
              const dossier = await fetchAuditById(item.id);
              const verifiedCount = dossier.evidenceMatrix.filter((e) => e.status === 'VERIFIED').length;
              const totalClaims = dossier.evidenceMatrix.length || 1;
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

              const resolvedName = item.candidateName || dossier.candidate.name || 'Kandidat';
              const resolvedRole = item.jobTitle || dossier.jobTitle || 'Software Engineer';

              loaded.push({
                id: item.id,
                name: resolvedName,
                role: resolvedRole,
                status: candidateStatus,
                statusLabel: candidateStatusLabel,
                stage: 'screening',
                matchScore: score,
                avatarSeed: resolvedName
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase(),
                githubUrl: dossier.candidate.githubUrl || '',
                reposCount: dossier.auditedRepos.length,
                dossier,
                chatHistory: [
                  {
                    role: 'assistant',
                    content: `Audit dimuat dari database SQLite lokal. ${dossier.overallAssessment}`,
                    timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ],
              });
            } catch (err) {
              console.warn('[App] Gagal memuat detail audit:', item.id, err);
            }
          }

          if (loaded.length > 0) {
            setCandidates((prev) => {
              if (prev.length === 0) return loaded;
              const existingIds = new Set(prev.map((c) => c.id));
              const missing = loaded.filter((c) => !existingIds.has(c.id));
              return [...prev, ...missing];
            });
          }
        }
      } catch (err) {
        console.warn('[App] SQLite sync error:', err);
      }
    };

    syncDatabaseHistory();
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

    const explicitName = (formData.get('candidateName') as string)?.trim();
    const explicitJobTitle = (formData.get('jobTitle') as string)?.trim();
    const tempCandidateName = explicitName || 'Kandidat Baru';
    const tempJobTitle = explicitJobTitle || 'Senior Software Engineer';
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

          const resolvedName = explicitName || dossierResult.candidate.name || tempCandidateName;
          const resolvedRole = explicitJobTitle || dossierResult.jobTitle || tempJobTitle;

          const newCandidate: WorkspaceCandidate = {
            id: dossierResult.id || `cand-${Date.now()}`,
            name: resolvedName,
            role: resolvedRole,
            status: candidateStatus,
            statusLabel: candidateStatusLabel,
            stage: 'screening',
            matchScore: score,
            avatarSeed: resolvedName
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

    const initialAgentMessage = {
      role: 'assistant' as const,
      content: '',
      timestamp: userTimestamp,
      anchors: [] as string[],
    };

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === activeCandidateId
          ? { ...c, chatHistory: [...c.chatHistory, userMessage, initialAgentMessage] }
          : c
      )
    );

    setIsDeliberating(true);

    try {
      await streamDeliberationQuestion(activeCandidate.dossier, messageText, {
        onStatus: (status) => {
          setCandidates((prev) =>
            prev.map((c) => {
              if (c.id !== activeCandidateId) return c;
              const history = [...c.chatHistory];
              const lastIdx = history.length - 1;
              if (lastIdx >= 0 && history[lastIdx].role === 'assistant' && !history[lastIdx].content) {
                history[lastIdx] = {
                  ...history[lastIdx],
                  content: `[${status}]\n\n`,
                };
              }
              return { ...c, chatHistory: history };
            })
          );
        },
        onToken: (token) => {
          setCandidates((prev) =>
            prev.map((c) => {
              if (c.id !== activeCandidateId) return c;
              const history = [...c.chatHistory];
              const lastIdx = history.length - 1;
              if (lastIdx >= 0 && history[lastIdx].role === 'assistant') {
                const currentContent = history[lastIdx].content;
                const cleanContent =
                  currentContent.startsWith('[') && currentContent.includes(']\n\n')
                    ? currentContent.replace(/^\[.*?\]\n\n/, '')
                    : currentContent;
                history[lastIdx] = {
                  ...history[lastIdx],
                  content: cleanContent + token,
                };
              }
              return { ...c, chatHistory: history };
            })
          );
        },
        onComplete: (res) => {
          const agentTimestamp = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          setCandidates((prev) =>
            prev.map((c) => {
              if (c.id !== activeCandidateId) return c;
              const history = [...c.chatHistory];
              const lastIdx = history.length - 1;
              if (lastIdx >= 0 && history[lastIdx].role === 'assistant') {
                history[lastIdx] = {
                  ...history[lastIdx],
                  content: history[lastIdx].content || res.answer,
                  timestamp: agentTimestamp,
                  anchors: res.anchors,
                };
              }
              const updatedRepos =
                res.newAuditedRepo && !c.dossier.auditedRepos.includes(res.newAuditedRepo)
                  ? [...c.dossier.auditedRepos, res.newAuditedRepo]
                  : c.dossier.auditedRepos;
              const updatedMatrix = res.newEvidenceItem
                ? [res.newEvidenceItem, ...c.dossier.evidenceMatrix]
                : c.dossier.evidenceMatrix;
              return {
                ...c,
                reposCount: updatedRepos.length,
                dossier: {
                  ...c.dossier,
                  auditedRepos: updatedRepos,
                  evidenceMatrix: updatedMatrix,
                },
                chatHistory: history,
              };
            })
          );
        },
        onError: (errMsg) => {
          setCandidates((prev) =>
            prev.map((c) => {
              if (c.id !== activeCandidateId) return c;
              const history = [...c.chatHistory];
              const lastIdx = history.length - 1;
              if (lastIdx >= 0 && history[lastIdx].role === 'assistant') {
                const currentContent = history[lastIdx].content;
                history[lastIdx] = {
                  ...history[lastIdx],
                  content: currentContent
                    ? `${currentContent}\n\n[Peringatan: ${errMsg}]`
                    : `Maaf, terjadi kendala komunikasi dengan router model: ${errMsg}`,
                };
              }
              return { ...c, chatHistory: history };
            })
          );
        },
      });
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : 'Gagal memproses deliberasi AI.';
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== activeCandidateId) return c;
          const history = [...c.chatHistory];
          const lastIdx = history.length - 1;
          if (lastIdx >= 0 && history[lastIdx].role === 'assistant') {
            const currentContent = history[lastIdx].content;
            history[lastIdx] = {
              ...history[lastIdx],
              content: currentContent
                ? `${currentContent}\n\n[Peringatan: ${errMsg}]`
                : `Maaf, terjadi kendala komunikasi dengan router model: ${errMsg}`,
            };
          }
          return { ...c, chatHistory: history };
        })
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
      for (const cand of candidates) {
        deleteAuditRecord(cand.id).catch(() => {});
      }
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
        jobs={jobs}
      />
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f7f4]">
      {/* Panel 1: Candidate Sidebar & Ingestion Queue */}
      {!isSidebarCollapsed && (
        <CandidateSidebar
          candidates={candidates}
          activeCandidateId={activeCandidateId}
          onSelectCandidate={setActiveCandidateId}
          onMoveStage={handleMoveCandidateStage}
          onOpenUploadModal={() => setIsAddModalOpen(true)}
          onOpenIntegrations={() => setIsIntegrationsOpen(true)}
          onClearCandidates={handleClearCandidates}
          onSwitchToApply={switchToApply}
          onOpenManageJobs={() => setIsManageJobsOpen(true)}
          jobsCount={jobs.length}
          googleStatus={googleStatus}
          onOpenBenchmark={handleOpenBenchmark}
          isBenchmarkActive={activeWorkspaceTab === 'benchmark'}
          onToggleCollapse={() => setIsSidebarCollapsed(true)}
          width={sidebarWidth}
        />
      )}

      {/* Left Resizer Handle */}
      {!isSidebarCollapsed && (
        <div
          onMouseDown={handleStartResizeLeft}
          className="w-1 hover:w-1.5 active:w-1.5 h-screen bg-[#dedbd3] hover:bg-[#7285d5] active:bg-[#7285d5] cursor-col-resize transition-all shrink-0 z-10 select-none"
          title="Tarik untuk mengubah lebar antrean kandidat"
        />
      )}

      {isSidebarCollapsed && (
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed top-2.5 left-2.5 z-30 px-2.5 py-1.5 rounded-lg bg-white border border-[#dedcd2] text-[#4d5162] hover:bg-[#f2f0ea] hover:text-[#22242c] shadow-sm transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title="Buka kembali antrean kandidat"
        >
          <Columns size={13} className="text-[#7285d5]" />
          <span>Antrean</span>
        </button>
      )}

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
        activeWorkspaceTab={activeWorkspaceTab}
        openWorkspaceTabs={openWorkspaceTabs}
        onSelectWorkspaceTab={handleSelectWorkspaceTab}
        onCloseWorkspaceTab={handleCloseWorkspaceTab}
        onViewCv={() => {
          handleSelectWorkspaceTab('cv');
        }}
        onInspectCode={() => {
          handleSelectWorkspaceTab('code:core-logic');
        }}
        googleStatus={googleStatus}
        allCandidates={candidates}
        slotAId={benchmarkSlotAId}
        slotBId={benchmarkSlotBId}
        onSelectSlotA={handleSelectBenchmarkSlotA}
        onSelectSlotB={handleSelectBenchmarkSlotB}
        onSelectCandidate={setActiveCandidateId}
        onCloseBenchmark={() => handleSelectWorkspaceTab('chat')}
        onMoveStage={handleMoveCandidateStage}
      />

      {/* Right Resizer Handle */}
      <div
        onMouseDown={handleStartResizeRight}
        className="w-1 hover:w-1.5 active:w-1.5 h-screen bg-[#dedbd3] hover:bg-[#7285d5] active:bg-[#7285d5] cursor-col-resize transition-all shrink-0 z-10 select-none"
        title="Tarik untuk mengubah lebar panel kanan"
      />

      {/* Panel 3: Right Inspector Panel - Arbiter Chat (Benchmark) atau Forensic Explorer */}
      {activeWorkspaceTab === 'benchmark' ? (
        <BenchmarkInspectorPanel
          candidateA={benchmarkCandidateA}
          candidateB={benchmarkCandidateB}
          messages={benchmarkMessages}
          isDeliberating={isBenchmarkDeliberating}
          onSendMessage={handleSendBenchmarkMessage}
          width={rightPanelWidth}
        />
      ) : (
        <ForensicExplorerPanel
          candidate={activeCandidate}
          activeTabId={activeWorkspaceTab}
          onSelectTab={handleSelectWorkspaceTab}
          width={rightPanelWidth}
        />
      )}
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

      <ManageJobsModal
        isOpen={isManageJobsOpen}
        onClose={() => setIsManageJobsOpen(false)}
        jobs={jobs}
        onUpdateJobs={setJobs}
      />
    </div>
  );
}
