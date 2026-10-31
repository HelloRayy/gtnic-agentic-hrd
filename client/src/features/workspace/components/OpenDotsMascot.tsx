import React from 'react';

export type DotCharacter = 'blue' | 'mint' | 'orange' | 'purple';
export type DotState = 'idle' | 'working' | 'complete' | 'paused' | 'needs-input';
export type DotSize = 'sm' | 'md' | 'lg' | 'xl';

export interface OpenDotsMascotProps {
  color?: DotCharacter;
  identity?: string;
  size?: DotSize;
  state?: DotState;
  isWorking?: boolean;
  name?: string;
  decorative?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const characters: readonly DotCharacter[] = ['blue', 'mint', 'orange', 'purple'] as const;

/**
 * Stable hash identity matching OpenDots algorithm to keep each personality recognizable.
 */
export function characterFor(identity?: string): DotCharacter {
  if (!identity) return 'blue';
  let hash = 0;
  for (let i = 0; i < identity.length; i++) {
    hash = (hash * 31 + identity.charCodeAt(i)) >>> 0;
  }
  return characters[hash % characters.length];
}

export const OpenDotsMascot: React.FC<OpenDotsMascotProps> = ({
  color,
  identity,
  size = 'md',
  state = 'idle',
  isWorking = false,
  name = 'Forensic Dot',
  decorative = false,
  className = '',
  style,
}) => {
  const chosenColor = color || characterFor(identity);
  const activeState = isWorking ? 'working' : state;

  const sizeDimensions: Record<DotSize, { width: number; height: number }> = {
    sm: { width: 30, height: 30 },
    md: { width: 48, height: 48 },
    lg: { width: 96, height: 96 },
    xl: { width: 140, height: 140 },
  };

  const dim = sizeDimensions[size] || sizeDimensions.md;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const imgSrc = `${cleanBase}opendots/dot-${chosenColor}.png`;

  return (
    <span
      className={`mascot ${activeState} mascot-${size} inline-flex items-center justify-center shrink-0 overflow-visible select-none ${className}`}
      style={{
        width: dim.width,
        height: dim.height,
        ...style,
      }}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <img
        className="dot-body w-full h-full object-contain pointer-events-none"
        src={imgSrc}
        alt={decorative ? '' : `${name} (${chosenColor}) is ${activeState}`}
        width={512}
        height={512}
        draggable={false}
      />
    </span>
  );
};
export interface OpenDotsQuadHeroProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OpenDotsQuadHero: React.FC<OpenDotsQuadHeroProps> = ({
  className = '',
  size = 'md',
}) => {
  const dots: Array<{ color: DotCharacter; delay: string }> = [
    { color: 'blue', delay: '0ms' },
    { color: 'mint', delay: '-800ms' },
    { color: 'orange', delay: '-1600ms' },
    { color: 'purple', delay: '-2400ms' },
  ];

  const sizeClass =
    size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-24 h-24' : 'w-16 h-16 sm:w-20 sm:h-20';

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return (
    <div
      aria-hidden="true"
      className={`hero-enter mx-auto flex items-end justify-center gap-1.5 sm:gap-3 select-none ${className}`}
      style={{ '--hero-delay': '0ms' } as React.CSSProperties}
    >
      {dots.map(({ color, delay }) => (
        <span
          key={color}
          className="dot-bob"
          style={{ '--bob-delay': delay } as React.CSSProperties}
        >
          <img
            alt=""
            draggable={false}
            loading="lazy"
            width={96}
            height={96}
            decoding="async"
            className={`shrink-0 select-none ${sizeClass} drop-shadow-[0_4px_12px_rgba(57,57,74,0.06)]`}
            src={`${cleanBase}opendots/dot-${color}.png`}
          />
        </span>
      ))}
    </div>
  );
};

export default OpenDotsMascot;
