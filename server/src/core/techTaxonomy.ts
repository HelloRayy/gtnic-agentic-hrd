export interface TechArchetype {
  category: string;
  categoryLabel: string;
  aliases: string[];
}

export const TECH_ARCHETYPES: TechArchetype[] = [
  {
    category: 'rdbms',
    categoryLabel: 'Relational Database (RDBMS)',
    aliases: ['postgresql', 'postgres', 'pg', 'mysql', 'mariadb', 'sqlite', 'cockroachdb', 'oracle', 'mssql'],
  },
  {
    category: 'nosql',
    categoryLabel: 'Document / NoSQL Store',
    aliases: ['mongodb', 'mongoose', 'dynamodb', 'cassandra', 'couchdb', 'firestore', 'couchbase'],
  },
  {
    category: 'caching',
    categoryLabel: 'In-Memory Caching & Key-Value',
    aliases: ['redis', 'ioredis', 'memcached', 'keydb', 'dragonfly'],
  },
  {
    category: 'message_broker',
    categoryLabel: 'Message Queue & Event Streaming',
    aliases: ['kafka', 'kafkajs', 'rabbitmq', 'amqplib', 'nats', 'sqs', 'bullmq', 'pulsar', 'activemq'],
  },
  {
    category: 'container_orchestration',
    categoryLabel: 'Containerization & Orchestration',
    aliases: ['docker', 'docker-compose', 'kubernetes', 'k8s', 'helm', 'podman', 'nomad', 'containerd'],
  },
  {
    category: 'state_management',
    categoryLabel: 'Frontend State Architecture',
    aliases: ['redux', 'zustand', 'jotai', 'mobx', 'recoil', 'pinia', 'vuex', 'tanstack/react-query', 'react-query'],
  },
  {
    category: 'web_framework',
    categoryLabel: 'Web / API Framework',
    aliases: ['express', 'fastify', 'nestjs', 'koa', 'hono', 'trpc', 'gin', 'fiber', 'actix', 'axum'],
  },
  {
    category: 'orm_query',
    categoryLabel: 'Data Mapping & Query Builders',
    aliases: ['prisma', 'typeorm', 'drizzle-orm', 'sequelize', 'knex', 'gorm', 'sqlx', 'hibernate'],
  },
  {
    category: 'testing',
    categoryLabel: 'Automated Testing Suite',
    aliases: ['jest', 'vitest', 'mocha', 'chai', 'cypress', 'playwright', 'testing-library', 'supertest', 'pytest'],
  },
];

export function findTransferableMatch(
  claimedSkill: string,
  manifestDeps: string[]
): { isTransferable: boolean; matchedDep?: string; categoryLabel?: string } {
  const claimLower = claimedSkill.toLowerCase().trim();
  const lowerDeps = manifestDeps.map((d) => d.toLowerCase());

  for (const archetype of TECH_ARCHETYPES) {
    const isClaimInArchetype = archetype.aliases.some(
      (alias) => claimLower.includes(alias) || alias.includes(claimLower)
    );

    if (isClaimInArchetype) {
      const matchingDep = lowerDeps.find((dep) =>
        archetype.aliases.some((alias) => dep.includes(alias))
      );

      if (matchingDep) {
        return {
          isTransferable: true,
          matchedDep: matchingDep,
          categoryLabel: archetype.categoryLabel,
        };
      }
    }
  }

  return { isTransferable: false };
}
