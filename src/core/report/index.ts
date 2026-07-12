import { StackRecommendation } from '../models/recommendation.js';
import { ProjectBrief } from '../models/brief.js';

export function generateJSONReport(
  recommendation: StackRecommendation,
  brief: ProjectBrief,
  verbose: boolean = false
): string {
  const reportObj = {
    metadata: {
      generatedAt: recommendation.metadata.generatedAt,
      project: recommendation.metadata.project,
      brief: verbose ? brief : undefined
    },
    stack: recommendation.recommendation,
    rationales: recommendation.rationale,
    risks: recommendation.risks,
    patterns: recommendation.patterns
  };

  return JSON.stringify(reportObj, null, 2);
}

export function generateMarkdownReport(
  recommendation: StackRecommendation,
  brief: ProjectBrief,
  verbose: boolean = false
): string {
  const r = recommendation.recommendation;
  const rat = recommendation.rationale;

  let md = `# Architecture Decisions Report — ${brief.product.name}\n\n`;
  md += `*Generated automatically by Dotstack on ${new Date(recommendation.metadata.generatedAt).toLocaleString()}*\n\n`;

  md += `## 1. Executive Summary\n\n`;
  md += `This report outlines the recommended technology stack for **${brief.product.name}**, a **${brief.product.type}** project being developed by a team of **${brief.team.devs}** devs (${brief.team.experience} experience level) with expected scale of **${brief.requirements.scale}**.\n\n`;

  if (brief.productSubtype) {
    md += `- **Product Subtype**: ${brief.productSubtype}\n`;
  }
  if (brief.compliance && brief.compliance.length > 0) {
    md += `- **Compliance Constraints**: ${brief.compliance.join(', ').toUpperCase()}\n`;
  }
  if (brief.dataResidency) {
    md += `- **Data Residency**: ${brief.dataResidency}\n`;
  }
  if (brief.multiTenant !== undefined) {
    md += `- **Multi-Tenancy Required**: ${brief.multiTenant ? 'Yes' : 'No'}\n`;
  }
  if (brief.realTime !== undefined) {
    md += `- **Real-Time Required**: ${brief.realTime ? 'Yes' : 'No'}\n`;
  }
  if (brief.haRequirements) {
    md += `- **HA Target Profile**: ${brief.haRequirements}\n`;
  }
  if (brief.security) {
    md += `- **Security Level**: ${brief.security.level} (Encryption: ${brief.security.encryption ? 'Yes' : 'No'}, Secrets Management: ${brief.security.secretsManagement ? 'Yes' : 'No'})\n`;
  }
  md += `\n`;

  md += `## 2. Core Recommendations\n\n`;
  md += `| Category | Technology | Rationale / Decision Justification |\n`;
  md += `|---|---|---|\n`;
  md += `| **Architecture Style** | ${r.architectureStyle} | ${rat.architectureStyle} |\n`;
  md += `| **Frontend** | ${r.frontend} | ${rat.frontend} |\n`;
  md += `| **Backend** | ${r.backend} | ${rat.backend} |\n`;
  md += `| **Database** | ${r.database} | ${rat.database} |\n`;
  if (r.cache) {
    md += `| **Cache** | ${r.cache} | ${rat.cache} |\n`;
  }
  if (r.aiFramework) {
    md += `| **AI Framework** | ${r.aiFramework} | ${rat.aiFramework} |\n`;
  }
  md += `| **Deployment / Cloud** | ${r.deployment} | ${rat.deployment} |\n`;
  if (r.observability) {
    md += `| **Observability** | ${r.observability} | ${rat.observability} |\n`;
  }
  if (r.messaging) {
    md += `| **Messaging / Queue** | ${r.messaging} | ${rat.messaging} |\n`;
  }
  if (r.testing) {
    md += `| **Testing Framework** | ${r.testing} | ${rat.testing} |\n`;
  }
  if (r.auth) {
    md += `| **Auth Provider** | ${r.auth} | ${rat.auth} |\n`;
  }
  if (r.security) {
    md += `| **Security Tools** | ${r.security} | ${rat.security} |\n`;
  }
  if (r.orchestration) {
    md += `| **Orchestration** | ${r.orchestration} | ${rat.orchestration} |\n`;
  }
  if (r.mobile) {
    md += `| **Mobile Stack** | ${r.mobile} | ${rat.mobile} |\n`;
  }
  md += `\n`;

  if (recommendation.risks.length > 0) {
    md += `## 3. Risks & Warnings Checklist\n\n`;
    for (const risk of recommendation.risks) {
      md += `- [ ] **WARNING**: ${risk}\n`;
    }
    md += `\n`;
  }

  if (recommendation.patterns.length > 0) {
    md += `## 4. Design Patterns & Reference Codebases\n\n`;
    for (const pattern of recommendation.patterns) {
      md += `### ${pattern.name}\n`;
      md += `${pattern.description}\n\n`;
      if (pattern.referenceUrl) {
        md += `*Reference documentation: [Link](${pattern.referenceUrl})*\n\n`;
      }
      if (pattern.examples && pattern.examples.length > 0) {
        md += `#### Reference Repositories:\n`;
        for (const ex of pattern.examples) {
          md += `- **[${ex.name}](${ex.url})** ${ex.description ? `— ${ex.description}` : ''}\n`;
        }
        md += `\n`;
      }
    }
  }

  if (verbose) {
    md += `\n## 5. Scoring Details (Verbose Brief Config)\n\n`;
    md += `\`\`\`json\n${JSON.stringify(brief, null, 2)}\n\`\`\`\n`;
  }

  return md;
}
