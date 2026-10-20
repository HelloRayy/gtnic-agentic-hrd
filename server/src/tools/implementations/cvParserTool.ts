import { PDFParse } from 'pdf-parse';
import type { BaseTool, ToolParamDef } from '../registry.js';
import type { CandidateProfile } from '../../core/types.js';

export interface CvParserParams {
  buffer?: Buffer;
  text?: string;
}

export interface CvParserResult {
  profile: CandidateProfile;
  rawText: string;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class CvParserTool implements BaseTool<CvParserParams, CvParserResult> {
  public name = 'cv_parser';
  public description = 'Extracts candidate profile, claimed skills, email, and GitHub URLs from CV PDF or raw text.';
  public parameterSchema: Record<string, ToolParamDef> = {
    buffer: { type: 'object', required: false, description: 'Binary buffer of the uploaded PDF file' },
    text: { type: 'string', required: false, description: 'Raw plaintext CV contents' },
  };

  public async execute(params: CvParserParams): Promise<CvParserResult> {
    let rawText = params.text || '';

    if (params.buffer) {
      try {
        const parser = new PDFParse({ data: params.buffer });
        const textResult = await parser.getText();
        rawText = textResult.text || '';
        await parser.destroy();
      } catch {
        rawText = params.buffer.toString('utf-8');
      }
    }

    const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : undefined;

    const githubMatch = rawText.match(/github\.com\/([a-zA-Z0-9_-]+)(?:\/[a-zA-Z0-9_.-]+)?/i);
    let githubUrl: string | undefined;
    let githubUsername: string | undefined;

    if (githubMatch) {
      githubUsername = githubMatch[1];
      githubUrl = `https://github.com/${githubUsername}`;
    }

    const commonSkills = [
      'TypeScript', 'JavaScript', 'Python', 'Go', 'Golang', 'Rust', 'Java', 'Kotlin', 'Swift', 'C++', 'C#',
      'React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte', 'Node.js', 'Express', 'NestJS', 'FastAPI', 'Django', 'Flask',
      'Spring Boot', 'Laravel', 'Ruby on Rails', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra',
      'Kafka', 'RabbitMQ', 'GraphQL', 'gRPC', 'WebSockets', 'Docker', 'Kubernetes', 'Helm', 'Terraform',
      'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD',
      'Microservices', 'Distributed Systems', 'Tailwind', 'TailwindCSS', 'Jest', 'Vitest', 'Cypress', 'Playwright',
      'LangChain', 'LlamaIndex', 'OpenAI', 'Gemini', 'RAG', 'Vector Database', 'Pinecone', 'Qdrant'
    ];

    const foundSkills: string[] = [];
    for (const skill of commonSkills) {
      const escaped = escapeRegex(skill);
      // For skills ending in special chars like C++ or C#, don't use trailing \b
      const pattern = /[+#]$/.test(skill) ? `(?:^|\\s)${escaped}(?:\\s|$)` : `\\b${escaped}\\b`;
      const regex = new RegExp(pattern, 'i');
      if (regex.test(rawText) && !foundSkills.includes(skill)) {
        foundSkills.push(skill);
      }
    }

    const junkHeaders = ['curriculum vitae', 'resume', 'cv', 'page 1', 'page 2', 'personal info', 'profile'];
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let candidateName = 'Unknown Candidate';

    for (const line of lines.slice(0, 8)) {
      const lower = line.toLowerCase();
      const isJunk = junkHeaders.some(j => lower === j || lower.startsWith(j + ' '));
      if (!isJunk && line.length > 2 && line.length < 50 && !line.includes('@') && !line.includes('http')) {
        candidateName = line.replace(/^[#*\-•\s]+/, '');
        break;
      }
    }

    return {
      profile: {
        name: candidateName,
        email,
        githubUrl,
        githubUsername,
        claimedSkills: foundSkills,
        summary: lines.slice(0, 10).join(' '),
      },
      rawText,
    };
  }
}
