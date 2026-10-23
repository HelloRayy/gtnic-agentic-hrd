import { toolRegistry } from './registry.js';
import { CvParserTool } from './implementations/cvParserTool.js';
import { GithubTriageTool, GithubRepoAuditTool } from './implementations/githubAuditorTool.js';
import { GoogleCalendarTool } from './implementations/googleCalendarTool.js';
import { GoogleMailTool } from './implementations/googleMailTool.js';

export function initializeTools(): void {
  toolRegistry.register(new CvParserTool());
  toolRegistry.register(new GithubTriageTool());
  toolRegistry.register(new GithubRepoAuditTool());
  toolRegistry.register(new GoogleCalendarTool());
  toolRegistry.register(new GoogleMailTool());
}

export { toolRegistry };
