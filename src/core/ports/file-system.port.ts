import { StackRecommendation } from '../models/recommendation.js';

export interface ProjectFile {
  relativePath: string;
  content: string;
}

export interface FileSystemPort {
  readBrief(filePath: string): Promise<unknown>;
  writeOutputs(
    recommendation: StackRecommendation,
    projectRoot: string
  ): Promise<{ yamlPath: string; mdPath: string }>;
  directoryExists(path: string): Promise<boolean>;
  getFilesRecursively(projectRoot: string): Promise<ProjectFile[]>;
}
