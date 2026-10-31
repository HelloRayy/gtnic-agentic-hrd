import React from 'react';

export interface TechAsset {
  icon: React.ReactNode;
  brandColor?: string;
}

// Crisp 14x14 inline SVG tech icons
const TS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="4" fill="#3178C6" />
    <path d="M4 8h8M8 8v11M14 16.5c1 1 2.3 1.5 3.8 1.5 1.8 0 2.7-.9 2.7-2.1 0-2.8-5.5-2-5.5-5.4 0-1.7 1.4-3 3.5-3 1.3 0 2.4.4 3.2 1.1l-.8 1.4c-.7-.5-1.5-.8-2.4-.8-1.3 0-2 .7-2 1.6 0 2.5 5.5 1.8 5.5 5.3 0 1.9-1.5 3.4-4.1 3.4-1.7 0-3.1-.6-4.2-1.7l1.3-1.3z" fill="#FFF" />
  </svg>
);

const JS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="4" fill="#F7DF1E" />
    <path d="M7.5 10.5v6.2c0 1.8-1 2.8-2.6 2.8-1 0-1.8-.4-2.4-1.1l1.2-1.4c.4.4.7.7 1.2.7.5 0 .8-.3.8-.9v-6.3h1.8zm7.2 6c.9 1 2.1 1.5 3.4 1.5 1.6 0 2.5-.8 2.5-1.9 0-2.5-4.9-1.8-4.9-4.8 0-1.5 1.3-2.7 3.1-2.7 1.2 0 2.1.4 2.9 1l-.7 1.3c-.6-.5-1.3-.7-2.1-.7-1.1 0-1.8.6-1.8 1.4 0 2.2 4.9 1.6 4.9 4.7 0 1.7-1.4 3-3.7 3-1.5 0-2.8-.5-3.8-1.5l1.2-1.3z" fill="#000" />
  </svg>
);

const REACT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <ellipse cx="12" cy="12" rx="4" ry="10.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="4" ry="10.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="4" ry="10.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)" />
    <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
  </svg>
);

const NODE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 2l8.5 4.9v9.8L12 21.6 3.5 16.7V6.9L12 2z" fill="#539E43" />
    <path d="M12 4.5l6.5 3.8v7.5L12 19.5 5.5 15.8V8.3L12 4.5z" fill="#333" />
    <path d="M12 8.5l4 2.3v4.6L12 17.7 8 15.4v-4.6l4-2.3z" fill="#539E43" />
  </svg>
);

const PYTHON_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M11.9 2c-3.1 0-4.9.4-4.9 2.5v2.5h5v.8H5.6C3.3 7.8 2 9.5 2 12.6c0 3.2 1.4 4.8 3.7 4.8h1.8v-2.3c0-2.4 2-4.5 4.4-4.5h4.4V8.2c0-2-1.8-6.2-4.4-6.2zm-2 1.8a1 1 0 110 2 1 1 0 010-2z" fill="#3776AB" />
    <path d="M12.1 22c3.1 0 4.9-.4 4.9-2.5V17h-5v-.8h6.4c2.3 0 3.6-1.7 3.6-4.8 0-3.2-1.4-4.8-3.7-4.8h-1.8v2.3c0 2.4-2 4.5-4.4 4.5H7.7v2.4c0 2 1.8 6.2 4.4 6.2zm2-1.8a1 1 0 110-2 1 1 0 010 2z" fill="#FFD43B" />
  </svg>
);

const GO_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="4" fill="#00ADD8" />
    <path d="M7.8 9.2a3.8 3.8 0 100 5.6h2.2v-2.2H7.8M13.5 12h5.5M16.5 9v6" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const RUST_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="9" stroke="#DEA584" strokeWidth="2" />
    <path d="M8.5 7h4a3 3 0 010 6h-4V7zm0 6h2.5l3 4.5" stroke="#DEA584" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const POSTGRES_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 3C7 3 4 6.5 4 11c0 5 3 9.5 7.5 10 1.5.2 2.5-1 2.5-2.2 0-1.8-1.5-2.8-1.5-4.8 0-1.5 1.2-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.2-.5 2-1 2.5 1 .2 2.5-.2 3.5-1.5 1.5-2 1.5-4.5 1-7C20.5 5 16.5 3 12 3z" fill="#336791" />
  </svg>
);

const REDIS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 2l9 4.5-9 4.5-9-4.5L12 2z" fill="#D82C20" />
    <path d="M3 11l9 4.5 9-4.5v3.5L12 19 3 14.5V11z" fill="#A81D14" />
    <path d="M3 16l9 4.5 9-4.5v3.5L12 24 3 19.5V16z" fill="#7A150E" />
  </svg>
);

const DOCKER_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M2.5 13.5c1.5-1 4.5-1 6.5.5s4 1.5 6 0c2-1.5 4.5-1.5 6.5 0 0 4-3 7.5-9 7.5S2.5 18 2.5 13.5z" fill="#2496ED" />
    <rect x="6" y="9" width="2.5" height="2.5" fill="#2496ED" rx="0.5" />
    <rect x="9.5" y="9" width="2.5" height="2.5" fill="#2496ED" rx="0.5" />
    <rect x="13" y="9" width="2.5" height="2.5" fill="#2496ED" rx="0.5" />
    <rect x="9.5" y="5.5" width="2.5" height="2.5" fill="#2496ED" rx="0.5" />
  </svg>
);

const K8S_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="9" stroke="#326CE5" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="#326CE5" />
    <path d="M12 3v6M12 15v6M4 7.5l5.2 3M14.8 13.5l5.2 3M4 16.5l5.2-3M14.8 10.5l5.2-3" stroke="#326CE5" strokeWidth="1.5" />
  </svg>
);

const TAILWIND_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M6.5 10c1.5-2 3.5-3 6-3 4 0 5 3 6.5 4.5 1.5 1.5 3 2 5 2-1.5 2-3.5 3-6 3-4 0-5-3-6.5-4.5-1.5-1.5-3-2-5-2zm-4.5 6c1.5-2 3.5-3 6-3 4 0 5 3 6.5 4.5 1.5 1.5 3 2 5 2-1.5 2-3.5 3-6 3-4 0-5-3-6.5-4.5-1.5-1.5-3-2-5-2z" fill="#38BDF8" />
  </svg>
);

const AWS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M4 16.5c4.5 3 11.5 3 16 0" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 15l2.5 1.5L18 18" stroke="#FF9900" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <text x="5" y="11" fill="#FF9900" fontSize="9" fontWeight="bold" fontFamily="sans-serif">aws</text>
  </svg>
);

const NEXTJS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="10" fill="#000" />
    <path d="M8 8v8l8-9.5M16 11v5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const VUE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M2 3h4.5l5.5 9.5L17.5 3H22L12 20.5 2 3z" fill="#42B883" />
    <path d="M6.5 3L12 12.5 17.5 3h-3.5L12 6.5 10 3H6.5z" fill="#35495E" />
  </svg>
);

const GRAPHQL_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z" stroke="#E10098" strokeWidth="1.8" />
    <circle cx="12" cy="2" r="1.5" fill="#E10098" />
    <circle cx="20.7" cy="7" r="1.5" fill="#E10098" />
    <circle cx="20.7" cy="17" r="1.5" fill="#E10098" />
    <circle cx="12" cy="22" r="1.5" fill="#E10098" />
    <circle cx="3.3" cy="17" r="1.5" fill="#E10098" />
    <circle cx="3.3" cy="7" r="1.5" fill="#E10098" />
  </svg>
);

const GIT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M21.5 11l-8.5-8.5a2 2 0 00-2.8 0L8.7 4l3.5 3.5a2.5 2.5 0 013 3l3.3 3.3a2.5 2.5 0 11-1.4 1.4l-3-3a2.5 2.5 0 01-3.6-3.2L7 5.5 2.5 10a2 2 0 000 2.8l8.5 8.5a2 2 0 002.8 0l7.7-7.7a2 2 0 000-2.6z" fill="#F05032" />
  </svg>
);

const LINUX_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="10" r="6" fill="#333" />
    <ellipse cx="12" cy="16" rx="7" ry="5" fill="#F9A825" />
    <circle cx="10" cy="9" r="1" fill="#FFF" />
    <circle cx="14" cy="9" r="1" fill="#FFF" />
  </svg>
);

const MONGO_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 2C10.5 7 7 11 7 15c0 3.5 2.2 6.5 5 7 2.8-.5 5-3.5 5-7 0-4-3.5-8-5-13z" fill="#47A248" />
    <path d="M12 2v20c-.3 0-.6-.1-.9-.2C8.8 21.2 7 18.5 7 15c0-4 3.5-8 5-13z" fill="#499D4A" />
  </svg>
);

const MYSQL_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M3 14c2-4 5-8 9-8s7 4 9 8c-2 2-5 3-9 3s-7-1-9-3z" fill="#00758F" />
    <path d="M12 7c-2 3-2 6 0 9 2-3 2-6 0-9z" fill="#F29111" />
  </svg>
);

const TERRAFORM_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M9 2l5.5 3.2v6.5L9 8.5V2z" fill="#844FBA" />
    <path d="M15.5 5.5L21 8.7v6.5l-5.5-3.2V5.5z" fill="#623CE4" />
    <path d="M9 9.5l5.5 3.2v6.5L9 16V9.5z" fill="#844FBA" />
    <path d="M2.5 5.5L8 8.7v6.5l-5.5-3.2V5.5z" fill="#00BC7F" />
  </svg>
);

const JAVA_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M6 14c0 3 2.7 5.5 6 5.5s6-2.5 6-5.5H6z" fill="#E76F00" />
    <path d="M10 3c-1 2 1 3 0 5M13 2c-1 2 1 4 0 6M15 4c-1 2 1 3 0 4" stroke="#5382A1" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const KOTLIN_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M2 2h20L12 12l10 10H2V2z" fill="#7F52FF" />
    <path d="M2 12l10-10H2v10z" fill="#C757BC" />
  </svg>
);

const PHP_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4" />
    <text x="7" y="14" fill="#FFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">php</text>
  </svg>
);

const RUBY_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M4 8l8-6 8 6-3 12H7L4 8z" fill="#CC342D" />
    <path d="M12 2l3 6-3 12-3-12 3-6z" fill="#E84A42" />
  </svg>
);

const CPP_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M12 2l8.7 5v10L12 22l-8.7-5V7L12 2z" fill="#00599C" />
    <text x="7" y="14" fill="#FFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">C++</text>
  </svg>
);
const VITE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M19.5 3L12 21 4.5 3h15z" fill="#BD34FE" />
    <path d="M14.5 3L12 17 8.5 3h6z" fill="#FFD43B" />
  </svg>
);

const KAFKA_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="6" cy="12" r="3" fill="#231F20" />
    <circle cx="18" cy="6" r="3" fill="#231F20" />
    <circle cx="18" cy="18" r="3" fill="#231F20" />
    <path d="M6 12l12-6M6 12l12 6" stroke="#231F20" strokeWidth="1.8" />
  </svg>
);

/**
 * Intelligent technology asset resolver.
 * Normalizes input and matches synonyms/abbreviations.
 * Returns null if not matched, allowing seamless fallback to label.
 */
export function getTechAsset(rawName: string): TechAsset | null {
  if (!rawName) return null;
  const clean = rawName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9+#.-]/g, '');

  // Exact & synonym matching table
  if (['ts', 'typescript'].includes(clean)) return { icon: TS_ICON, brandColor: '#3178C6' };
  if (['js', 'javascript', 'ecmascript'].includes(clean)) return { icon: JS_ICON, brandColor: '#F7DF1E' };
  if (['react', 'reactjs', 'react.js', 'reactnative'].includes(clean)) return { icon: REACT_ICON, brandColor: '#61DAFB' };
  if (['node', 'nodejs', 'node.js', 'express', 'expressjs', 'nest', 'nestjs'].includes(clean)) return { icon: NODE_ICON, brandColor: '#539E43' };
  if (['python', 'py', 'django', 'fastapi', 'flask'].includes(clean)) return { icon: PYTHON_ICON, brandColor: '#3776AB' };
  if (['go', 'golang'].includes(clean)) return { icon: GO_ICON, brandColor: '#00ADD8' };
  if (['rust', 'cargo'].includes(clean)) return { icon: RUST_ICON, brandColor: '#DEA584' };
  if (['postgres', 'postgresql', 'psql', 'pg'].includes(clean)) return { icon: POSTGRES_ICON, brandColor: '#336791' };
  if (['redis'].includes(clean)) return { icon: REDIS_ICON, brandColor: '#D82C20' };
  if (['docker', 'container'].includes(clean)) return { icon: DOCKER_ICON, brandColor: '#2496ED' };
  if (['k8s', 'kubernetes'].includes(clean)) return { icon: K8S_ICON, brandColor: '#326CE5' };
  if (['tailwind', 'tailwindcss', 'tailwind-css'].includes(clean)) return { icon: TAILWIND_ICON, brandColor: '#38BDF8' };
  if (['aws', 'amazonwebservices', 'ec2', 's3', 'lambda'].includes(clean)) return { icon: AWS_ICON, brandColor: '#FF9900' };
  if (['next', 'nextjs', 'next.js'].includes(clean)) return { icon: NEXTJS_ICON, brandColor: '#000000' };
  if (['vue', 'vuejs', 'vue.js', 'nuxt'].includes(clean)) return { icon: VUE_ICON, brandColor: '#42B883' };
  if (['graphql', 'gql'].includes(clean)) return { icon: GRAPHQL_ICON, brandColor: '#E10098' };
  if (['git', 'github', 'gitlab'].includes(clean)) return { icon: GIT_ICON, brandColor: '#F05032' };
  if (['linux', 'ubuntu', 'debian', 'bash'].includes(clean)) return { icon: LINUX_ICON, brandColor: '#F9A825' };
  if (['mongo', 'mongodb'].includes(clean)) return { icon: MONGO_ICON, brandColor: '#47A248' };
  if (['mysql', 'mariadb'].includes(clean)) return { icon: MYSQL_ICON, brandColor: '#00758F' };
  if (['terraform'].includes(clean)) return { icon: TERRAFORM_ICON, brandColor: '#844FBA' };
  if (['java', 'spring', 'springboot'].includes(clean)) return { icon: JAVA_ICON, brandColor: '#E76F00' };
  if (['kotlin'].includes(clean)) return { icon: KOTLIN_ICON, brandColor: '#7F52FF' };
  if (['php', 'laravel'].includes(clean)) return { icon: PHP_ICON, brandColor: '#777BB4' };
  if (['ruby', 'rails'].includes(clean)) return { icon: RUBY_ICON, brandColor: '#CC342D' };
  if (['c++', 'cpp'].includes(clean)) return { icon: CPP_ICON, brandColor: '#00599C' };
  if (['vite', 'vitejs'].includes(clean)) return { icon: VITE_ICON, brandColor: '#BD34FE' };
  if (['kafka', 'apachekafka'].includes(clean)) return { icon: KAFKA_ICON, brandColor: '#231F20' };

  // Fallback: If no direct brand asset exists, return null so component falls back gracefully to text label
  return null;
}
