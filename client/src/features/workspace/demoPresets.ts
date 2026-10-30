export interface RecruitmentPreset {
  id: string;
  title: string;
  shortLabel: string;
  jobDesc: string;
}

export interface CandidateSnippet {
  name: string;
  role: string;
  githubUrl: string;
  jobDesc: string;
  cvText: string;
}

export const RECRUITMENT_PRESETS: RecruitmentPreset[] = [
  {
    id: 'frontend',
    title: 'Frontend Web Engineer (Enterprise UI)',
    shortLabel: 'Frontend UI',
    jobDesc:
      'Membutuhkan Engineer dengan keahlian React, TypeScript, Tailwind CSS, Vite, manajemen komponen antarmuka, dan integrasi API frontend.',
  },
  {
    id: 'distributed',
    title: 'Senior Distributed Systems Architect',
    shortLabel: 'Distributed Systems',
    jobDesc:
      'Membutuhkan 5+ tahun pengalaman dalam arsitektur mikroservis terdistribusi, Apache Kafka, PostgreSQL partitioning, Kubernetes, Docker, dan CI/CD pipeline skala tinggi.',
  },
  {
    id: 'fullstack-ai',
    title: 'Fullstack AI / Python Engineer',
    shortLabel: 'Fullstack AI',
    jobDesc:
      'Membutuhkan Engineer dengan keahlian Next.js, TypeScript, Python FastAPI, Vector Database, RAG pipelines, dan integrasi model LLM.',
  },
];

export const DEMO_PRESET_SNIPPETS: Record<'rayhan' | 'johnDoe', CandidateSnippet> = {
  rayhan: {
    name: 'Rayhan Pratama',
    role: 'Frontend Web Engineer (Enterprise UI)',
    githubUrl: 'https://github.com/HelloRayy',
    jobDesc:
      'Membutuhkan Engineer dengan keahlian React, TypeScript, Tailwind CSS, Vite, manajemen komponen antarmuka, dan integrasi API frontend.',
    cvText: `Rayhan Pratama - Frontend Web Engineer
Email: rayhan.pratama@example.com
GitHub: https://github.com/HelloRayy
Lokasi: Jakarta, Indonesia

RINGKASAN PROFESIONAL:
Software Engineer dengan spesialisasi pengembangan antarmuka web modern, landing page performa tinggi, dan aplikasi web interaktif. Berpengalaman menggunakan ekosistem React, TypeScript, Tailwind CSS, Vite, serta integrasi state management.

KEAHLIAN TEKNIS (CLAIMS):
- Framework & Bahasa: React, TypeScript, JavaScript (ES6+), Dart, HTML5, CSS3
- Styling & Desain: Tailwind CSS, CSS Modules, Responsive Web Design
- Build Tools & Workflow: Vite, Git, GitHub Actions, npm, Node.js
- Arsitektur: REST API Integration, Component-Driven Development, Modular UI

PENGALAMAN PROYEK:
1. Ether AI Landing Page & Modern Web Portals:
   - Membangun landing page modern berbasis React dan Tailwind CSS dengan fokus pada visual clean dan responsivitas.
   - Mengoptimalkan waktu muat halaman dan transisi antarmuka.
2. Expense Tracker & Productivity Apps:
   - Mengembangkan aplikasi pencatatan finansial dengan integrasi state management dan pemisahan logika bisnis yang rapi.`,
  },
  johnDoe: {
    name: "John 'Arch' Doe",
    role: 'Senior Distributed Systems Architect',
    githubUrl: 'https://github.com/octocat',
    jobDesc:
      'Membutuhkan 5+ tahun pengalaman dalam arsitektur mikroservis terdistribusi, Apache Kafka, PostgreSQL partitioning, Kubernetes, Docker, dan CI/CD pipeline skala tinggi.',
    cvText: `John 'Arch' Doe - Staff Distributed Systems Architect
Email: john.architect@example.com
GitHub: https://github.com/octocat
Lokasi: Singapore

RINGKASAN PROFESIONAL:
Senior Systems Architect dengan 6+ tahun pengalaman memimpin transformasi cloud native, orkestrasi microservices skala jutaan transaksi per hari, dan optimasi database terdistribusi.

KEAHLIAN UTAMA (CLAIMS):
- Distributed Architecture: Microservices, Event-Driven Architecture, Apache Kafka, gRPC
- Database: PostgreSQL Partitioning, Redis Caching, Distributed Locks
- Cloud & DevOps: Kubernetes, Docker, Terraform, CI/CD Automated Pipelines, Multi-stage Builds
- Backend Runtime: Go, Rust, Node.js, High Concurrency Pipelines

PENGALAMAN KERJA:
1. Lead Cloud Architect - Enterprise Global Tech (2021 - Sekarang):
   - Mendesain pipeline microservices dengan toleransi kegagalan tinggi dan latency di bawah 15ms.
   - Mengelola klaster Kubernetes multi-region dengan zero-downtime deployment.
2. Senior Systems Engineer - FinTech Payment Gateway (2018 - 2021):
   - Mengimplementasikan isolasi transaksi basis data dan mitigasi race condition pada sistem pembayaran terdistribusi.`,
  },
};
