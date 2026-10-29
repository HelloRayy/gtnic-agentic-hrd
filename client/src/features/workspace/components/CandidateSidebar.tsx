import React from 'react';
import { Plus, User, Calendar } from 'lucide-react';
import { OpenDotsMascot } from './OpenDotsMascot.js';
import type { WorkspaceCandidate } from '../types.js';
import type { GoogleAuthStatus } from '@/types/audit.js';

interface CandidateSidebarProps {
  candidates: WorkspaceCandidate[];
  activeCandidateId: string;
  onSelectCandidate: (id: string) => void;
  onOpenUploadModal: () => void;
  onOpenIntegrations: () => void;
  googleStatus: GoogleAuthStatus | null;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  candidates,
  activeCandidateId,
  onSelectCandidate,
  onOpenUploadModal,
  onOpenIntegrations,
  googleStatus,
}) => {
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

      {/* Minimal OpenDots Ingestion Button */}
      <button
        type="button"
        onClick={onOpenUploadModal}
        className="btn-press"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '9px 13px',
          borderRadius: 8,
          border: '1px solid #e9e8e6',
          backgroundColor: '#ffffff',
          color: '#242424',
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 18,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(57,57,74,0.02)',
          transition: 'all 0.15s ease',
        }}
      >
        <Plus size={16} strokeWidth={2} style={{ color: '#7285d5' }} />
        <span>Tambah Pelamar</span>
      </button>

      {/* Candidates Queue (Dots Nav) */}
      <div
        className="nav-label"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#767676',
          letterSpacing: '0.6px',
          marginBottom: 8,
          padding: '0 4px',
        }}
      >
        ANTREAN PELAMAR ({candidates.length})
      </div>
      <nav
        className="dots-nav"
        style={{
          overflowY: 'auto',
          flex: 1,
          maxHeight: 'calc(100vh - 380px)',
          paddingRight: 2,
        }}
      >
        {candidates.map((cand) => {
          const isActive = cand.id === activeCandidateId;
          return (
            <button
              type="button"
              key={cand.id}
              onClick={() => onSelectCandidate(cand.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                marginBottom: 4,
                borderRadius: 8,
                border: 0,
                backgroundColor: isActive ? '#eeeff7' : 'transparent',
                color: isActive ? '#596aa9' : '#707070',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isActive ? '#e0e4f4' : '#f0eee9',
                  color: isActive ? '#596aa9' : '#858690',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={16} strokeWidth={isActive ? 2 : 1.75} />
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
                      fontSize: 13.5,
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
                      fontSize: 10.5,
                      fontWeight: 550,
                      color: isActive ? '#596aa9' : '#767676',
                      background: isActive ? '#e0e4f4' : '#eeede9',
                      padding: '2px 6px',
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  >
                    {cand.dossier?.evidenceMatrix
                      ? `${cand.dossier.evidenceMatrix.filter((e) => e.status === 'VERIFIED').length}/${cand.dossier.evidenceMatrix.length} Bukti`
                      : cand.statusLabel}
                  </small>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
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
            </button>
          );
        })}
      </nav>

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

        <div className="dot-note" style={{ padding: '16px 10px 18px' }}>
          <span className="tiny-star" style={{ fontSize: 24 }}>✦</span>
          <p style={{ fontSize: 11.5, color: '#707070', lineHeight: 1.6 }}>
            AST Forensics & GitHub live check aktif untuk setiap pelamar.
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
