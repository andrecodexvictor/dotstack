import { z } from 'zod';

export const ProductTypeSchema = z.enum([
  'SaaS',
  'API',
  'MobileApp',
  'CLI',
  'InternalTool',
  'WebApp'
]);

export type ProductType = z.infer<typeof ProductTypeSchema>;

export const ExperienceLevelSchema = z.enum([
  'junior',
  'intermediate',
  'senior'
]);

export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;

export const ScaleRequirementsSchema = z.enum([
  'low',
  'medium',
  'high'
]);

export type ScaleRequirements = z.infer<typeof ScaleRequirementsSchema>;

export const LatencyRequirementsSchema = z.enum([
  'normal',
  'low-latency'
]);

export type LatencyRequirements = z.infer<typeof LatencyRequirementsSchema>;

export const AvailabilityRequirementsSchema = z.enum([
  'normal',
  'high-availability'
]);

export type AvailabilityRequirements = z.infer<typeof AvailabilityRequirementsSchema>;

export const LanguagePreferenceSchema = z.enum([
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Java',
  'Kotlin',
  'Rust',
  'Ruby',
  'Elixir',
  'PHP',
  'CSharp'
]);

export type LanguagePreference = z.infer<typeof LanguagePreferenceSchema>;

export const DatabasePreferenceSchema = z.enum([
  'PostgreSQL',
  'MongoDB',
  'SQLite',
  'Redis',
  'MySQL',
  'Cassandra',
  'Neo4j',
  'Qdrant',
  'DynamoDB',
  'MariaDB',
  'CockroachDB',
  'Amazon Aurora (PostgreSQL)',
  'Amazon Aurora (MySQL)',
  'AWS RDS (PostgreSQL)',
  'AWS RDS (MySQL)',
  'Google Cloud SQL',
  'Google Cloud Spanner',
  'Azure SQL Database',
  'Azure CosmosDB',
  'Firestore',
  'Supabase (PostgreSQL)',
  'PlanetScale',
  'Neon',
  'TiDB'
]);

export type DatabasePreference = z.infer<typeof DatabasePreferenceSchema>;

export const CloudPreferenceSchema = z.enum([
  'AWS',
  'Vercel',
  'Render',
  'Docker',
  'GCP',
  'Azure',
  'Fly.io',
  'Cloudflare',
  'Supabase',
  'Railway'
]);

export type CloudPreference = z.infer<typeof CloudPreferenceSchema>;

export const AiFrameworkPreferenceSchema = z.enum([
  'LangChain',
  'LlamaIndex',
  'LangGraph'
]);

export type AiFrameworkPreference = z.infer<typeof AiFrameworkPreferenceSchema>;

export const ProductSubtypeSchema = z.enum([
  'api',
  'saas',
  'internal-tool',
  'agentic-system',
  'ecommerce',
  'marketplace',
  'data-platform'
]);

export type ProductSubtype = z.infer<typeof ProductSubtypeSchema>;

export const ComplianceSchema = z.enum([
  'lgpd',
  'gdpr',
  'pci',
  'hipaa'
]);

export type Compliance = z.infer<typeof ComplianceSchema>;

export const HaRequirementsSchema = z.enum([
  'none',
  'standard',
  'high',
  'critical'
]);

export type HaRequirements = z.infer<typeof HaRequirementsSchema>;

export const SecurityLevelSchema = z.enum([
  'basic',
  'standard',
  'hardened'
]);

export type SecurityLevel = z.infer<typeof SecurityLevelSchema>;

export const SecuritySchema = z.object({
  level: SecurityLevelSchema.default('standard'),
  encryption: z.boolean().default(false),
  secretsManagement: z.boolean().default(false)
});

export type Security = z.infer<typeof SecuritySchema>;

export const ProjectBriefSchema = z.object({
  product: z.object({
    name: z.string(),
    type: ProductTypeSchema
  }),
  team: z.object({
    devs: z.number().int().positive(),
    experience: ExperienceLevelSchema
  }),
  requirements: z.object({
    scale: ScaleRequirementsSchema,
    latency: LatencyRequirementsSchema.default('normal'),
    availability: AvailabilityRequirementsSchema.default('normal')
  }),
  constraints: z.preprocess(
    (val) => (val === null || val === undefined ? {} : val),
    z.object({
      language: LanguagePreferenceSchema.optional(),
      database: DatabasePreferenceSchema.optional(),
      cloud: CloudPreferenceSchema.optional(),
      aiFramework: AiFrameworkPreferenceSchema.optional(),
      budget: z.number().positive().optional()
    }).default({})
  ),
  productSubtype: ProductSubtypeSchema.optional(),
  compliance: z.array(ComplianceSchema).optional(),
  dataResidency: z.string().optional(),
  multiTenant: z.boolean().optional(),
  realTime: z.boolean().optional(),
  haRequirements: HaRequirementsSchema.optional(),
  security: SecuritySchema.optional()
});

export type ProjectBrief = z.infer<typeof ProjectBriefSchema>;

