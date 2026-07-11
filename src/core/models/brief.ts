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
  'Python',
  'Go',
  'Java',
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
  'DynamoDB'
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
  'Supabase'
]);

export type CloudPreference = z.infer<typeof CloudPreferenceSchema>;

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
      budget: z.number().positive().optional()
    }).default({})
  )
});

export type ProjectBrief = z.infer<typeof ProjectBriefSchema>;
