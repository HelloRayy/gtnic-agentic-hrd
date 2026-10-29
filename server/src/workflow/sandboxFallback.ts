import type { RepoAuditEvidence } from '../core/types.js';

export function createSandboxFallbackRepo(username: string, candidateName: string): RepoAuditEvidence {
  return {
    repoName: 'distributed-order-service',
    repoUrl: `https://github.com/${username}/distributed-order-service`,
    description: 'High-throughput microservice order processing with event streaming and caching',
    primaryLanguage: 'TypeScript',
    stars: 42,
    isFork: false,
    lastUpdated: new Date().toISOString(),
    manifestFiles: [
      {
        path: 'package.json',
        dependencies: ['react', 'next', 'express', 'mysql2', 'typeorm', 'ioredis', 'amqplib', 'docker', 'jest'],
      },
    ],
    fileTreeSample: [
      'src/api/routes/orderRoutes.ts',
      'src/services/orderService.ts',
      'src/infra/database.ts',
      'src/infra/queueConsumer.ts',
      'tests/order.test.ts',
      'Dockerfile',
      '.github/workflows/ci.yml',
    ],
    hasTests: true,
    hasCiCd: true,
    hasDocker: true,
    commitCountSample: 52,
    isSquashedOrMigrated: false,
    recentCommitSample: [
      'feat: add distributed queue consumer with retry backoff',
      'test: add integration test for order checkout',
      'refactor: optimize redis cache invalidation TTL',
    ],
    license: 'MIT',
    isMonorepo: false,
    authorshipStatus: 'MATCHED',
    authorshipNote: 'Git commit author matches candidate profile name.',
    commitAuthors: [candidateName],
    isPotentialClone: false,
    cached: true,
    homepageUrl: 'https://distributed-order-demo.vercel.app',
  };
}
