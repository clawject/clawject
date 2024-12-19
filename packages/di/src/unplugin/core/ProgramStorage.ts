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
      project.updateSourceFile(fileName, content, { scriptKind: this.getScriptKind(fileName) });
    } else {
      project.createSourceFile(fileName, content, { scriptKind: this.getScriptKind(fileName) });
    }
  }

  private getScriptKind(fileName: string): ts.ScriptKind {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
    case 'ts':
      return ts.ScriptKind.TS;
    case 'tsx':
      return ts.ScriptKind.TSX;
    case 'js':
      return ts.ScriptKind.JS;
    case 'jsx':
      return ts.ScriptKind.JSX;
    default:
      return ts.ScriptKind.Unknown;
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
