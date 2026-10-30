import React, { useState } from 'react';
import { Plus, User, Calendar, GripVertical } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import type { WorkspaceCandidate } from '../types.js';
import type { GoogleAuthStatus } from '@/types/audit.js';

interface CandidateSidebarProps {
  candidates: WorkspaceCandidate[];
  activeCandidateId: string | null;
  onSelectCandidate: (id: string) => void;
  onMoveStage?: (
    candidateId: string,
    newStage: 'screening' | 'interview' | 'accepted'
  ) => void;
  onOpenUploadModal: () => void;
  onOpenIntegrations: () => void;
  onClearCandidates?: () => void;
  googleStatus: GoogleAuthStatus | null;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  candidates,
  activeCandidateId,
  onSelectCandidate,
  onMoveStage,
  onOpenUploadModal,
  onOpenIntegrations,
  onClearCandidates,
  googleStatus,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const stages: Array<{
    id: 'screening' | 'interview' | 'accepted';
    label: string;
    dotColor: string;
  }> = [
    { id: 'screening', label: 'Screening', dotColor: '#8c8d97' },
    { id: 'interview', label: 'Interview', dotColor: '#7285d5' },
    { id: 'accepted', label: 'Lolos / Lanjut', dotColor: '#8cac91' },
  ];

  return (
    <aside className="sidebar" style={{ width: 280 }}>
      {/* Authentic OpenDots Wordmark */}
      <button type="button" className="wordmark">
        <span className="dotted-logo">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>TalentTrace</span>
        <span className="wordmark-dot">•</span>
      </button>

      {/* Authentic OpenDots Profile Card */}
      <div className="profile">
        <div className="profile-mascot">
          <OpenDotsMascot color="blue" size="md" />
        </div>
        <span className="online-dot" />
        <div className="profile-label">
          <strong>Forensic Dot</strong>
          <span>ready · AST live</span>
        </div>
      </div>

      {/* Ingestion & Reset Controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <button
          type="button"
          onClick={onOpenUploadModal}
          className="btn-press"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flex: 1,
            padding: '9px 13px',
            borderRadius: 8,
            border: '1px solid #e9e8e6',
            backgroundColor: '#ffffff',
            color: '#242424',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(57,57,74,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={16} strokeWidth={2} style={{ color: '#7285d5' }} />
          <span>Tambah Pelamar</span>
        </button>

        {candidates.length > 0 && onClearCandidates && (
          <button
            type="button"
            onClick={onClearCandidates}
            title="Reset antrean demo"
            style={{
              padding: '0 10px',
              borderRadius: 8,
              border: '1px solid #e9e8e6',
              backgroundColor: '#ffffff',
              color: '#8c8d97',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Reset
          </button>
        )}
      </div>

      {candidates.length === 0 && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            backgroundColor: '#f6f5f1',
            border: '1px dashed #dedcd8',
            marginBottom: 12,
            fontSize: 11,
            color: '#707070',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          Antrean kosong. Klik <strong>+ Tambah Pelamar</strong> untuk mulai.
        </div>
      )}
      {/* Candidates Classified by 3 Stages with Hand Drag & Drop */}
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          maxHeight: 'calc(100vh - 380px)',
          paddingRight: 2,
        }}
      >
        {stages.map((stage) => {
          const stageCandidates = candidates.filter(
            (c) => (c.stage || 'screening') === stage.id
          );
          const isOver = dragOverStage === stage.id;

          return (
            <div key={stage.id} style={{ marginBottom: 12 }}>
              {/* Stage Category Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                  marginBottom: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: stage.dotColor,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 650,
                      color: '#555660',
                      letterSpacing: '0.6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stage.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: '#8c8d97',
                    backgroundColor: '#eeede9',
                    padding: '1px 6px',
                    borderRadius: 10,
                  }}
                >
                  {stageCandidates.length}
                </span>
              </div>

              {/* Drag & Drop Target Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverStage(stage.id);
                }}
                onDragLeave={() => {
                  if (dragOverStage === stage.id) setDragOverStage(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const candId = e.dataTransfer.getData('text/plain');
                  if (candId && onMoveStage) {
                    onMoveStage(candId, stage.id);
                  }
                  setDragOverStage(null);
                  setDraggingId(null);
                }}
                style={{
                  minHeight: stageCandidates.length === 0 ? 38 : 'auto',
                  borderRadius: 8,
                  padding: 2,
                  transition: 'all 0.15s ease',
                  border: isOver
                    ? '1.5px dashed #7285d5'
                    : stageCandidates.length === 0
                    ? '1px dashed #dedee6'
                    : '1px solid transparent',
                  backgroundColor: isOver ? '#eeeff7' : 'transparent',
                }}
              >
                {stageCandidates.length === 0 ? (
                  <div
                    style={{
                      fontSize: 10.5,
                      color: '#a3a3ab',
                      textAlign: 'center',
                      padding: '10px 4px',
                      userSelect: 'none',
                    }}
                  >
                    Tarik kandidat ke sini
                  </div>
                ) : (
                  stageCandidates.map((cand) => {
                    const isActive = cand.id === activeCandidateId;
                    const isDraggingThis = draggingId === cand.id;

                    return (
                      <div
                        key={cand.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', cand.id);
                          setDraggingId(cand.id);
                        }}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDragOverStage(null);
                        }}
                        style={{
                          cursor: isDraggingThis ? 'grabbing' : 'grab',
                          opacity: isDraggingThis ? 0.45 : 1,
                          marginBottom: 4,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectCandidate(cand.id)}
                          className={`nav-item ${isActive ? 'active' : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '9px 11px',
                            borderRadius: 8,
                            border: 0,
                            backgroundColor: isActive ? '#eeeff7' : '#ffffff',
                            color: isActive ? '#596aa9' : '#707070',
                            width: '100%',
                            textAlign: 'left',
                            boxShadow: '0 1px 2px rgba(57,57,74,0.02)',
                            transition: 'background 0.15s ease, color 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 7,
                              background: isActive ? '#e0e4f4' : '#f0eee9',
                              color: isActive ? '#596aa9' : '#858690',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <User size={15} strokeWidth={isActive ? 2 : 1.75} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: isActive ? 600 : 550,
                                  color: '#242424',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {cand.name}
                              </span>
                              <small
                                style={{
                                  fontSize: 10,
                                  fontWeight: 550,
                                  color: isActive ? '#596aa9' : '#767676',
                                  background: isActive ? '#e0e4f4' : '#eeede9',
                                  padding: '1.5px 5px',
                                  borderRadius: 4,
                                  flexShrink: 0,
                                }}
                              >
                                {cand.matchScore}%
                              </small>
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: '#707070',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginTop: 2,
                                lineHeight: 1.3,
                              }}
                            >
                              {cand.role}
                            </div>
                          </div>

                          <GripVertical
                            size={13}
                            className="text-[#c0c3ce] shrink-0 opacity-40 hover:opacity-100"
                          />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer with OpenDots Star Note and Integrations */}
      <div className="sidebar-bottom">
        <button
          type="button"
          onClick={onOpenIntegrations}
          className="nav-item btn-press"
          style={{
            border: '1px solid #e9e8e6',
            borderRadius: 8,
            background: '#ffffff',
            padding: '11px 14px',
            marginBottom: 6,
            cursor: 'pointer',
          }}
        >
          <Calendar size={16} strokeWidth={1.75} style={{ color: '#7285d5' }} />
          <span style={{ fontSize: 12.5, fontWeight: 500, color: '#242424' }}>
            Google Workspace
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: googleStatus?.isAuthenticated ? '#8cac91' : '#dedcd8',
              marginLeft: 'auto',
            }}
          />
        </button>

        <div className="dot-note" style={{ padding: '14px 10px 16px' }}>
          <span className="tiny-star" style={{ fontSize: 24 }}>✦</span>
          <p style={{ fontSize: 11, color: '#707070', lineHeight: 1.6 }}>
            Geser kartu pelamar dengan tangan untuk klasifikasi status otonom.
          </p>
        </div>

        <div className="version" style={{ fontSize: 8.5, color: '#a0a0ac' }}>
          <span>GTNIC 2026</span>
          <span>v2.4 · AG-UI</span>
        </div>
      </div>
    </aside>
  );
};
