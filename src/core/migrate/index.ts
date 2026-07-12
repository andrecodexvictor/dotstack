export interface MigrationTask {
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  estimatedHours: number;
}

export interface MigrationPhase {
  name: string;
  description: string;
  tasks: MigrationTask[];
}

export interface MigrationPlan {
  currentStack: Record<string, string>;
  targetStack: Record<string, string>;
  totalEstimatedWeeks: number;
  overallRisk: 'low' | 'medium' | 'high';
  phases: MigrationPhase[];
}

export class MigrationPlanner {
  public plan(
    current: Record<string, string>,
    target: Record<string, string>
  ): MigrationPlan {
    const phases: MigrationPhase[] = [];
    let totalHours = 0;
    let maxRisk: 'low' | 'medium' | 'high' = 'low';

    // Helper to add tasks to phases
    const getOrCreatePhase = (name: string, description: string): MigrationPhase => {
      let phase = phases.find(p => p.name === name);
      if (!phase) {
        phase = { name, description, tasks: [] };
        phases.push(phase);
      }
      return phase;
    };

    // 1. Analyze Database migration
    if (current.database && target.database && current.database !== target.database) {
      const fromDb = current.database;
      const toDb = target.database;
      maxRisk = 'high';

      const phaseInfra = getOrCreatePhase('Phase 1: Infrastructure Setup', 'Provision and configure new databases and services.');
      phaseInfra.tasks.push({
        title: `Provision ${toDb} instance`,
        description: `Set up the new target database ${toDb} in your staging/production environments.`,
        effort: 'medium',
        estimatedHours: 12
      });

      const phaseCode = getOrCreatePhase('Phase 2: Code Refactoring', 'Update database drivers, ORM configurations, and queries.');
      phaseCode.tasks.push({
        title: `Migrate ORM / Connection settings from ${fromDb} to ${toDb}`,
        description: `Replace client drivers (e.g. SQLite connection with node-postgres or pg pool settings).`,
        effort: 'high',
        estimatedHours: 35
      });

      const phaseData = getOrCreatePhase('Phase 3: Data Migration & Sync', 'Extract, transform, and load historical database schemas and data.');
      phaseData.tasks.push({
        title: `Write schema mapping script for ${fromDb} -> ${toDb}`,
        description: `Map tables/collections, indexes, and primary key structures.`,
        effort: 'high',
        estimatedHours: 24
      });
      phaseData.tasks.push({
        title: `Execute historical ETL dump and restore`,
        description: `Perform historical data sync, verify row counts, constraints, and index integrity.`,
        effort: 'medium',
        estimatedHours: 16
      });

      totalHours += 87;
    }

    // 2. Analyze Backend migration
    if (current.backend && target.backend && current.backend !== target.backend) {
      const fromBe = current.backend;
      const toBe = target.backend;

      const isExpressToNest = fromBe.includes('Express') && toBe.includes('NestJS');
      const backendRisk = isExpressToNest ? 'medium' : 'high';
      if (backendRisk === 'high') {
        maxRisk = 'high';
      } else if (maxRisk === 'low') {
        maxRisk = 'medium';
      }

      const phasePrep = getOrCreatePhase('Phase 1: Infrastructure Setup', 'Provision and configure new databases and services.');
      phasePrep.tasks.push({
        title: `Initialize new ${toBe} boilerplate skeleton`,
        description: `Install required CLI tools, framework cores, and test tooling configurations.`,
        effort: 'low',
        estimatedHours: 8
      });

      const phaseCode = getOrCreatePhase('Phase 2: Code Refactoring', 'Update database drivers, ORM configurations, and queries.');
      
      if (isExpressToNest) {
        phaseCode.tasks.push({
          title: 'Migrate routing controllers to NestJS Controllers',
          description: 'Rebuild express app.get/post endpoints into decorated NestJS Controllers.',
          effort: 'medium',
          estimatedHours: 20
        });
        phaseCode.tasks.push({
          title: 'Extract Express middleware into NestJS Guards/Interceptors',
          description: 'Re-implement authentication, CORS, rate limiting, and request loggers.',
          effort: 'medium',
          estimatedHours: 16
        });
        totalHours += 44;
      } else {
        phaseCode.tasks.push({
          title: `Port core business logic to ${toBe}`,
          description: `Rewrite controllers, services, database models, and utilities into the target framework syntax.`,
          effort: 'high',
          estimatedHours: 60
        });
        totalHours += 68;
      }
    }

    // 3. Analyze Frontend migration
    if (current.frontend && target.frontend && current.frontend !== target.frontend) {
      const fromFe = current.frontend;
      const toFe = target.frontend;
      
      const phaseCode = getOrCreatePhase('Phase 2: Code Refactoring', 'Update database drivers, ORM configurations, and queries.');
      phaseCode.tasks.push({
        title: `Re-architect views and components in ${toFe}`,
        description: `Convert page layouts, routing, states, and api hooks from ${fromFe} to ${toFe}.`,
        effort: 'high',
        estimatedHours: 40
      });
      totalHours += 40;
    }

    // 4. Verification phase if there's any task
    if (phases.length > 0) {
      const phaseVerify = getOrCreatePhase('Phase 4: Verification & Cutover', 'Perform regression tests, canary releases, and switch traffic.');
      phaseVerify.tasks.push({
        title: 'Run integration & regression suite',
        description: 'Verify system boundaries, check data integrity, and run end-to-end user path flows.',
        effort: 'medium',
        estimatedHours: 12
      });
      phaseVerify.tasks.push({
        title: 'Phased rollout (canary deployment)',
        description: 'Split traffic incrementally to ensure new deployments remain stable under production load.',
        effort: 'medium',
        estimatedHours: 8
      });
      totalHours += 20;
    }

    const totalEstimatedWeeks = Math.max(1, Math.round(totalHours / 40));

    return {
      currentStack: current,
      targetStack: target,
      totalEstimatedWeeks,
      overallRisk: maxRisk,
      phases
    };
  }
}
