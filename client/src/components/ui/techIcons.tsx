import React from 'react';
import {
  JavaScriptIcon,
  Typescript01Icon,
  ReactIcon,
  PythonIcon,
  TailwindcssIcon,
  NextIcon,
  JavaIcon,
  PhpIcon,
  CppIcon,
  DartIcon,
  HtmlFiveIcon,
  CssThreeIcon,
  Database01Icon,
  CloudServerIcon,
  ServerStack01Icon,
  ComputerTerminal01Icon,
  GitBranchIcon,
} from 'hugeicons-react';
import {
  Container,
  Boxes,
  Terminal,
  Cpu,
} from 'lucide-react';

export interface TechAsset {
  icon: React.ReactNode;
  brandColor?: string;
}

/**
 * Intelligent technology asset resolver using real, professional React icon libraries
 * (hugeicons-react & lucide-react) to avoid SVG scaling and clipping glitches.
 * Returns null if not matched, allowing seamless fallback to text label.
 */
export function getTechAsset(rawName: string): TechAsset | null {
  if (!rawName) return null;
  const clean = rawName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9+#.-]/g, '');

  // Languages & Core Runtimes
  if (['ts', 'typescript'].includes(clean)) {
    return {
      icon: <Typescript01Icon size={14} className="text-[#3178c6] shrink-0" />,
      brandColor: '#3178c6',
    };
  }
  if (['js', 'javascript', 'ecmascript'].includes(clean)) {
    return {
      icon: <JavaScriptIcon size={14} className="text-[#ca8a04] shrink-0" />,
      brandColor: '#eab308',
    };
  }
  if (['react', 'reactjs', 'react.js', 'reactnative'].includes(clean)) {
    return {
      icon: <ReactIcon size={14} className="text-[#0891b2] shrink-0" />,
      brandColor: '#06b6d4',
    };
  }
  if (['python', 'py', 'django', 'fastapi', 'flask'].includes(clean)) {
    return {
      icon: <PythonIcon size={14} className="text-[#2563eb] shrink-0" />,
      brandColor: '#3b82f6',
    };
  }
  if (['node', 'nodejs', 'node.js', 'express', 'expressjs', 'nest', 'nestjs'].includes(clean)) {
    return {
      icon: <ComputerTerminal01Icon size={14} className="text-[#16a34a] shrink-0" />,
      brandColor: '#16a34a',
    };
  }
  if (['tailwind', 'tailwindcss', 'tailwind-css'].includes(clean)) {
    return {
      icon: <TailwindcssIcon size={14} className="text-[#0284c7] shrink-0" />,
      brandColor: '#0284c7',
    };
  }
  if (['next', 'nextjs', 'next.js'].includes(clean)) {
    return {
      icon: <NextIcon size={14} className="text-[#18181b] shrink-0" />,
      brandColor: '#18181b',
    };
  }
  if (['java', 'spring', 'springboot'].includes(clean)) {
    return {
      icon: <JavaIcon size={14} className="text-[#ea580c] shrink-0" />,
      brandColor: '#ea580c',
    };
  }
  if (['php', 'laravel'].includes(clean)) {
    return {
      icon: <PhpIcon size={14} className="text-[#6366f1] shrink-0" />,
      brandColor: '#6366f1',
    };
  }
  if (['c++', 'cpp'].includes(clean)) {
    return {
      icon: <CppIcon size={14} className="text-[#0284c7] shrink-0" />,
      brandColor: '#0284c7',
    };
  }
  if (['dart', 'flutter'].includes(clean)) {
    return {
      icon: <DartIcon size={14} className="text-[#0284c7] shrink-0" />,
      brandColor: '#0284c7',
    };
  }
  if (['html', 'html5'].includes(clean)) {
    return {
      icon: <HtmlFiveIcon size={14} className="text-[#ea580c] shrink-0" />,
      brandColor: '#ea580c',
    };
  }
  if (['css', 'css3'].includes(clean)) {
    return {
      icon: <CssThreeIcon size={14} className="text-[#2563eb] shrink-0" />,
      brandColor: '#2563eb',
    };
  }
  if (['go', 'golang'].includes(clean)) {
    return {
      icon: <Terminal size={14} className="text-[#00add8] shrink-0" />,
      brandColor: '#00add8',
    };
  }
  if (['rust', 'cargo'].includes(clean)) {
    return {
      icon: <Cpu size={14} className="text-[#b45309] shrink-0" />,
      brandColor: '#b45309',
    };
  }

  // Databases & Caching
  if (['postgres', 'postgresql', 'psql', 'pg'].includes(clean)) {
    return {
      icon: <Database01Icon size={14} className="text-[#2563eb] shrink-0" />,
      brandColor: '#2563eb',
    };
  }
  if (['redis'].includes(clean)) {
    return {
      icon: <Database01Icon size={14} className="text-[#dc2626] shrink-0" />,
      brandColor: '#dc2626',
    };
  }
  if (['mysql', 'mariadb'].includes(clean)) {
    return {
      icon: <Database01Icon size={14} className="text-[#0284c7] shrink-0" />,
      brandColor: '#0284c7',
    };
  }
  if (['mongo', 'mongodb'].includes(clean)) {
    return {
      icon: <Database01Icon size={14} className="text-[#16a34a] shrink-0" />,
      brandColor: '#16a34a',
    };
  }
  if (['sqlite', 'sqlite3', 'database', 'sql'].includes(clean)) {
    return {
      icon: <Database01Icon size={14} className="text-[#0369a1] shrink-0" />,
      brandColor: '#0369a1',
    };
  }

  // DevOps, Containers & Cloud
  if (['docker', 'container', 'dockerfile'].includes(clean)) {
    return {
      icon: <Container size={14} className="text-[#0284c7] shrink-0" />,
      brandColor: '#0284c7',
    };
  }
  if (['k8s', 'kubernetes'].includes(clean)) {
    return {
      icon: <Boxes size={14} className="text-[#2563eb] shrink-0" />,
      brandColor: '#2563eb',
    };
  }
  if (['aws', 'amazonwebservices', 'ec2', 's3', 'lambda'].includes(clean)) {
    return {
      icon: <CloudServerIcon size={14} className="text-[#d97706] shrink-0" />,
      brandColor: '#d97706',
    };
  }
  if (['gcp', 'googlecloud', 'azure', 'terraform', 'cloud'].includes(clean)) {
    return {
      icon: <CloudServerIcon size={14} className="text-[#4f46e5] shrink-0" />,
      brandColor: '#4f46e5',
    };
  }
  if (['git', 'github', 'gitlab', 'actions', 'cicd'].includes(clean)) {
    return {
      icon: <GitBranchIcon size={14} className="text-[#ea580c] shrink-0" />,
      brandColor: '#ea580c',
    };
  }
  if (['graphql', 'gql', 'api', 'rest'].includes(clean)) {
    return {
      icon: <ServerStack01Icon size={14} className="text-[#db2777] shrink-0" />,
      brandColor: '#db2777',
    };
  }
  if (['vite', 'vitejs'].includes(clean)) {
    return {
      icon: <Terminal size={14} className="text-[#9333ea] shrink-0" />,
      brandColor: '#9333ea',
    };
  }

  // Fallback: Return null if no specific tech icon exists, so it displays clean label text
  return null;
}
