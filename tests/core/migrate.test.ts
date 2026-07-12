import { describe, it, expect } from 'vitest';
import { MigrationPlanner } from '../../src/core/migrate/index.js';

describe('MigrationPlanner', () => {
  const planner = new MigrationPlanner();

  it('should generate steps and phases for backend and database transitions', () => {
    const current = {
      backend: 'TypeScript (Express)',
      database: 'SQLite'
    };

    const target = {
      backend: 'TypeScript (NestJS)',
      database: 'PostgreSQL'
    };

    const plan = planner.plan(current, target);

    expect(plan.overallRisk).toBe('high'); // DB change drives high risk
    expect(plan.totalEstimatedWeeks).toBeGreaterThanOrEqual(2);

    // Verify correct phases exist
    const phaseNames = plan.phases.map(p => p.name);
    expect(phaseNames).toContain('Phase 1: Infrastructure Setup');
    expect(phaseNames).toContain('Phase 2: Code Refactoring');
    expect(phaseNames).toContain('Phase 3: Data Migration & Sync');
    expect(phaseNames).toContain('Phase 4: Verification & Cutover');

    // Verify tasks generated
    const allTasks = plan.phases.flatMap(p => p.tasks.map(t => t.title));
    expect(allTasks).toContain('Provision PostgreSQL instance');
    expect(allTasks).toContain('Migrate ORM / Connection settings from SQLite to PostgreSQL');
    expect(allTasks).toContain('Migrate routing controllers to NestJS Controllers');
  });

  it('should return empty phases if current and target stacks are identical', () => {
    const current = {
      backend: 'TypeScript (NestJS)',
      database: 'PostgreSQL'
    };

    const plan = planner.plan(current, current);

    expect(plan.phases).toHaveLength(0);
    expect(plan.totalEstimatedWeeks).toBe(1);
    expect(plan.overallRisk).toBe('low');
  });
});
