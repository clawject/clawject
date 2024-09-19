import ts from 'typescript';
import { Options } from '../types';
import { Project } from '@ts-morph/bootstrap';
import { createTSMorphProject } from './createTSMorphProject';

//TODO add tests for different version with unplugin
export class ProgramStorage {
  constructor(
    private options: Options,
  ) {}

  private fileNameToFileContent = new Map<string, string>();

  async updateFile(fileName: string, content: string): Promise<void> {
    const project = await this.getProject();
    this.fileNameToFileContent.set(fileName, content);

    if (project.getSourceFile(fileName)) {
      project.updateSourceFile(fileName, content);
    } else {
      project.createSourceFile(fileName, content);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const project = await this.getProject();

    this.fileNameToFileContent.delete(fileName);
    project.removeSourceFile(fileName);
  }

  private project: Promise<Project> | undefined = undefined;

  getProject(): Promise<Project> {
    this.project = this.project ?? createTSMorphProject({
      tsConfigFilePath: this.options.tsconfig,
      skipAddingFilesFromTsConfig: true
    });

    return this.project;
  }

  private program: ts.Program | undefined = undefined;

  async getProgram(): Promise<ts.Program> {
    return this.program ?? this.refreshProgram();
  }

  async refreshProgram(): Promise<ts.Program> {
    const oldProgram = this.program;
    const needsUpdate = !oldProgram || this.checkIfProgramNeedsUpdate(oldProgram);
    if (!needsUpdate) {
      return oldProgram;
    }

    const project = await this.getProject();
    project.resolveSourceFileDependencies();
    this.program = project.createProgram() as unknown as ts.Program;

    return this.program;
  }

  private checkIfProgramNeedsUpdate(oldProgram: ts.Program): boolean {
    let result = false;

    for (const [fileName, content] of this.fileNameToFileContent) {
      if (result) {
        break;
      }

      const oldSourceFile = oldProgram.getSourceFile(fileName);

      if (!oldSourceFile || oldSourceFile.text !== content) {
        result = true;
        break;
      }
    }

    return result;
  }
}
