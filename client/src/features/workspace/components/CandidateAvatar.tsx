import React, { useState } from 'react';
import { OpenDotsMascot, type DotCharacter } from './OpenDotsMascot.js';

interface CandidateAvatarProps {
  name: string;
  githubUrl?: string;
  githubUsername?: string;
  avatarUrl?: string;
  identity?: string;
  color?: DotCharacter;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Extracts clean GitHub username from full URL, @handle, or plain string.
 */
function extractGitHubUsername(urlOrUsername?: string): string | null {
  if (!urlOrUsername) return null;
  const clean = urlOrUsername.trim().replace(/^@/, '');
  const match = clean.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) return match[1];
  if (!clean.includes('/') && !clean.includes('.') && clean.length > 0) return clean;
  return null;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({
  name,
  githubUrl,
  githubUsername,
  avatarUrl,
  identity,
  color,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const username = githubUsername || extractGitHubUsername(githubUrl);
  const resolvedUrl = avatarUrl || (username ? `https://github.com/${username}.png?size=128` : null);

  const sizeDimensions = {
    sm: 'w-[32px] h-[32px] rounded-[7px]',
    md: 'w-[48px] h-[48px] rounded-[10px]',
    lg: 'w-[64px] h-[64px] rounded-[12px]',
  };

  if (!resolvedUrl || imgError) {
    return <OpenDotsMascot identity={identity || name} color={color} size={size} />;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden border border-[#e4e2dd] bg-white shadow-[0_1px_3px_rgba(57,57,74,0.06)] ${sizeDimensions[size]} ${className}`}
    >
      <img
        src={resolvedUrl}
        alt={`Avatar ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover select-none"
      />
    </div>
  );
};

export default CandidateAvatar;
