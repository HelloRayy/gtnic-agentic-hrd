import { describe, it, expect } from 'vitest';
import { findTransferableMatch, TECH_ARCHETYPES } from './techTaxonomy.js';

describe('techTaxonomy - Transferable Skill Detection', () => {
  it('should verify defined archetypes are populated', () => {
    expect(TECH_ARCHETYPES.length).toBeGreaterThanOrEqual(9);
    const rdbms = TECH_ARCHETYPES.find((a) => a.category === 'rdbms');
    expect(rdbms).toBeDefined();
    expect(rdbms?.aliases).toContain('postgresql');
    expect(rdbms?.aliases).toContain('mysql');
  });

  it('should detect transferable skill within RDBMS category', () => {
    const result = findTransferableMatch('PostgreSQL', ['mysql', 'express']);
    expect(result.isTransferable).toBe(true);
    expect(result.matchedDep).toBe('mysql');
    expect(result.categoryLabel).toBe('Relational Database (RDBMS)');
  });

  it('should detect transferable skill within State Management category', () => {
    const result = findTransferableMatch('Redux', ['zustand', 'react']);
    expect(result.isTransferable).toBe(true);
    expect(result.matchedDep).toBe('zustand');
    expect(result.categoryLabel).toBe('Frontend State Architecture');
  });

  it('should detect transferable skill within Message Broker category', () => {
    const result = findTransferableMatch('RabbitMQ', ['bullmq', 'ioredis']);
    expect(result.isTransferable).toBe(true);
    expect(result.matchedDep).toBe('bullmq');
    expect(result.categoryLabel).toBe('Message Queue & Event Streaming');
  });

  it('should return isTransferable false when no archetype match exists', () => {
    const result = findTransferableMatch('QuantumComputing', ['react', 'express']);
    expect(result.isTransferable).toBe(false);
    expect(result.matchedDep).toBeUndefined();
  });

  it('should return isTransferable false when claim matches archetype but dependencies do not', () => {
    const result = findTransferableMatch('PostgreSQL', ['docker', 'react']);
    expect(result.isTransferable).toBe(false);
  });
});
