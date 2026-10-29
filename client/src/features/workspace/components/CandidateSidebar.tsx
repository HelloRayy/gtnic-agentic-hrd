import React from 'react';
import { Plus, Users, Calendar } from 'lucide-react';
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
    <aside className="sidebar">
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

      {/* Primary Ingestion Action Button */}
      <button
        type="button"
        onClick={onOpenUploadModal}
        className="primary full inline-flex items-center justify-center gap-2"
        style={{ marginBottom: 18 }}
      >
        <Plus size={16} />
        <span>Tambah Pelamar / CV</span>
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
            >
              <Users size={16} strokeWidth={isActive ? 2 : 1.65} />
              <span>{cand.name}</span>
              <small>{cand.matchScore}%</small>
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
