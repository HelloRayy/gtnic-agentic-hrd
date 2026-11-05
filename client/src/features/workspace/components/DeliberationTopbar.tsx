import React from 'react';
import type { WorkspaceCandidate } from '../types.js';

interface DeliberationTopbarProps {
  candidate: WorkspaceCandidate | null;
  isLoading?: boolean;
  onReaudit?: () => void;
  onOpenWebIde?: () => void;
}

export const DeliberationTopbar: React.FC<DeliberationTopbarProps> = ({
  candidate,
}) => {
  return (
    <header className="topbar select-none">
      {/* TalentTrace Navigation Breadcrumbs */}
      <div className="breadcrumbs">
        <span>TalentTrace</span>
        <span>/</span>
        <span>Antrean</span>
        <span>/</span>
        <strong>{candidate ? candidate.name : 'Workspace Siap'}</strong>
      </div>
    </header>
  );
};

export default DeliberationTopbar;
