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

      {/* Minimal OpenDots Ingestion Button as requested */}
      <button
        type="button"
        onClick={onOpenUploadModal}
        className="btn-press"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #e9e8e6',
          backgroundColor: '#ffffff',
          color: '#333641',
          fontSize: 12,
          fontWeight: 500,
          marginBottom: 18,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(57,57,74,0.02)',
          transition: 'all 0.15s ease',
        }}
      >
        <Plus size={15} strokeWidth={2} style={{ color: '#7285d5' }} />
        <span>Tambah Pelamar</span>
      </button>
      {/* Candidates Queue (Dots Nav) */}
      <div className="nav-label">
        ANTREAN PELAMAR ({candidates.length})
      </div>
      <nav
        className="dots-nav"
        style={{
          overflowY: 'auto',
          flex: 1,
          maxHeight: 'calc(100vh - 390px)',
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
                gap: 10,
                padding: '9px 12px',
                marginBottom: 4,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: isActive ? '#e2e7f8' : '#f0eee9',
                  color: isActive ? '#596aa9' : '#858690',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={14} strokeWidth={isActive ? 2 : 1.75} />
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
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#333641' : '#4d4f59',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cand.name}
                  </span>
                  <small
                    style={{
                      fontSize: 9.5,
                      fontWeight: 500,
                      color: isActive ? '#596aa9' : '#8c8d97',
                      background: isActive ? '#e0e4f4' : '#eeede9',
                      padding: '1px 5px',
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  >
                    {cand.matchScore}%
                  </small>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#8c8d97',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: 1,
                    lineHeight: 1.25,
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
          className="nav-item"
          style={{
            border: '1px solid #e9e8e6',
            borderRadius: 8,
            background: '#ffffff',
            padding: '10px 12px',
            marginBottom: 6,
          }}
        >
          <Calendar size={15} strokeWidth={1.75} style={{ color: '#7285d5' }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: '#333641' }}>
            Google Workspace
          </span>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: googleStatus?.isAuthenticated ? '#8cac91' : '#dedcd8',
              marginLeft: 'auto',
            }}
          />
        </button>

        <div className="dot-note">
          <span className="tiny-star">✦</span>
          <p>AST Forensics & GitHub live check aktif untuk setiap pelamar.</p>
        </div>

        <div className="version">
          <span>GTNIC 2026</span>
          <span>v2.4 · AG-UI</span>
        </div>
      </div>
    </aside>
  );
};
