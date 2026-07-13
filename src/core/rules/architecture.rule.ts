import { Rule } from './index.js';
import { ProjectBrief } from '../models/brief.js';
import { ScoringRegistry } from '../models/recommendation.js';

export class ArchitectureRule implements Rule {
  name = 'Architecture Style Rule';
  description = 'Decides between Monolith, Modular Monolith, and Microservices based on team size and scale.';

  evaluate(brief: ProjectBrief, registry: ScoringRegistry): void {
    const devs = brief.team.devs;
    const scale = brief.requirements.scale;

    const isAiSupported = !!brief.team.aiSupported || !!brief.team.onePersonBillionBusiness;

    if (devs < 6) {
      if (scale === 'high') {
        if (isAiSupported) {
          registry.architectureStyle['Microservices'] += 40;
          registry.architectureStyle['Modular Monolith'] += 50;
          registry.architectureStyle['Monolith'] += 10;
          registry.rationales.architectureStyle = 
            `Modular Monolith or Microservices chosen. AI-agent support (${devs} dev(s) with AI automation) handles the operational overhead of distributed systems at high scale.`;
        } else {
          registry.architectureStyle['Modular Monolith'] += 50;
          registry.architectureStyle['Monolith'] += 20;
          registry.architectureStyle['Microservices'] -= 100;

          registry.risks.push(
            `Microservices are discouraged for teams with only ${devs} developer(s) due to overhead.`
          );
          registry.rationales.architectureStyle = 
            `Modular Monolith chosen to support high scaling and clean modular boundaries for a small team (${devs} dev(s)).`;
        }
      } else {
        if (isAiSupported) {
          registry.architectureStyle['Modular Monolith'] += 40;
          registry.architectureStyle['Monolith'] += 40;
          registry.architectureStyle['Microservices'] += 10;
          registry.rationales.architectureStyle = 
            `Monolith or Modular Monolith chosen. AI agent support allows building modular structures with minimal human friction.`;
        } else {
          registry.architectureStyle['Monolith'] += 50;
          registry.architectureStyle['Modular Monolith'] += 30;
          registry.architectureStyle['Microservices'] -= 100;

          registry.risks.push(
            `Microservices are discouraged for teams with only ${devs} developer(s) due to overhead.`
          );
          registry.rationales.architectureStyle = 
            `Monolith chosen because the team is small (${devs} dev(s)). Minimizes infrastructure and synchronization overhead.`;
        }
      }
    } else {
      if (scale === 'high') {
        registry.architectureStyle['Microservices'] += 40;
        registry.architectureStyle['Modular Monolith'] += 50;
        registry.architectureStyle['Monolith'] += 10;
        registry.rationales.architectureStyle = 
          'Modular Monolith chosen for a larger team with high scale requirements to maintain modularity with manageable complexity.';
      } else {
        registry.architectureStyle['Modular Monolith'] += 50;
        registry.architectureStyle['Monolith'] += 30;
        registry.architectureStyle['Microservices'] += 10;
        registry.rationales.architectureStyle = 
          'Modular Monolith chosen to facilitate division of labor for a team of ' + devs + ' devs without microservice overhead.';
      }
    }
  }
}
