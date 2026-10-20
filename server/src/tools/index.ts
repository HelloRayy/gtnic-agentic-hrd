import { toolRegistry } from './registry.js';
import { CvParserTool } from './implementations/cvParserTool.js';
import { GithubTriageTool, GithubRepoAuditTool } from './implementations/githubAuditorTool.js';

export function initializeTools(): void {
  toolRegistry.register(new CvParserTool());
  toolRegistry.register(new GithubTriageTool());
  toolRegistry.register(new GithubRepoAuditTool());
}

export { toolRegistry };
