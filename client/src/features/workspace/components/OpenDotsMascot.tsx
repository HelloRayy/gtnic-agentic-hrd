import React from 'react';

interface OpenDotsMascotProps {
  color?: 'blue' | 'mint' | 'orange' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isWorking?: boolean;
}

export const OpenDotsMascot: React.FC<OpenDotsMascotProps> = ({
  color = 'blue',
  size = 'md',
  className = '',
  isWorking = false,
}) => {
  const colorSchemes = {
    blue: {
      body: '#8898dc',
      dark: '#7485cb',
      blush: '#ffa6be',
    },
    mint: {
      body: '#8cac91',
      dark: '#769c7b',
      blush: '#ffd4b2',
    },
    orange: {
      body: '#e2a36b',
      dark: '#cf8e54',
      blush: '#ffc1a6',
    },
    purple: {
      body: '#a392ce',
      dark: '#8b78b9',
      blush: '#ffa6e2',
    },
  };

  const current = colorSchemes[color] || colorSchemes.blue;

  const sizeDimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 44, height: 44 },
    lg: { width: 130, height: 130 },
  };

  const { width, height } = sizeDimensions[size];

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${
        isWorking ? 'animate-bounce duration-1000' : ''
      } ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(57,57,74,0.06)]"
      >
        {/* Squircle Body */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="32"
          fill={current.body}
          stroke={current.dark}
          strokeWidth="3.5"
        />

        {/* Cheek Blushes */}
        <circle cx="26" cy="58" r="4.5" fill={current.blush} opacity="0.65" />
        <circle cx="74" cy="58" r="4.5" fill={current.blush} opacity="0.65" />

        {/* Left Eye */}
        <ellipse cx="36" cy="46" rx="4.5" ry="6.5" fill="#333641" />
        <circle cx="37.5" cy="44" r="1.8" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="64" cy="46" rx="4.5" ry="6.5" fill="#333641" />
        <circle cx="65.5" cy="44" r="1.8" fill="#ffffff" />

        {/* Subtle Happy Mouth */}
        <path
          d="M 46 54 Q 50 57 54 54"
          stroke="#333641"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
