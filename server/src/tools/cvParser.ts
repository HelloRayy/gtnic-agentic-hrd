import { PDFParse } from 'pdf-parse';
import type { CandidateProfile } from '../types/agent.js';

export async function parseCvBuffer(buffer: Buffer): Promise<{ profile: CandidateProfile; rawText: string }> {
  let rawText = '';
  try {
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    rawText = textResult.text || '';
    await parser.destroy();
  } catch (err) {
    rawText = buffer.toString('utf-8');
  }

  return parseCvText(rawText);
}

export function parseCvText(rawText: string): { profile: CandidateProfile; rawText: string } {
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
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Golang', 'Rust', 'Java', 'Kotlin', 'Swift',
    'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'NestJS', 'FastAPI', 'Django',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'GraphQL', 'gRPC',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'GitHub Actions', 'Terraform',
    'Microservices', 'Distributed Systems', 'Tailwind', 'GraphQL', 'REST API'
  ];

  const foundSkills: string[] = [];
  for (const skill of commonSkills) {
    const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(rawText)) {
      foundSkills.push(skill);
    }
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let candidateName = 'Unknown Candidate';
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && line.length < 50 && !line.includes('@') && !line.includes('http')) {
      candidateName = line;
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
