import ts from 'typescript';
import { MessageType } from './messages/MessageType';
import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';

export class CompilationContext {
  areErrorsHandled = false;
  languageServiceMode = false;
  private _contextualFileName: string | null = null;
  private pathToMessages = new Map<string, AbstractCompilationMessage[]>();

  private _program: ts.Program | null = null;

  get program(): ts.Program {
    if (!this._program) {
      throw new Error('Program is not assigned, most likely you didn\'t add transformer to your tsconfig.json or webpack configuragtion');
    }

    return this._program;
  }

  get typeChecker(): ts.TypeChecker {
    return this.program.getTypeChecker();
  }

  get contextualFileName(): string {
    if (!this._contextualFileName) {
      throw new Error('Current file is not assigned in compilation context, it is an internal error, please report it on github https://github.com/clawject/clawject/issues/new.');
    }

    return this._contextualFileName;
  }

  getAllMessages(): AbstractCompilationMessage[] {
    return Array.from(this.pathToMessages.values()).flat();
  }

  getMessages(fileName: string): AbstractCompilationMessage[] {
    return this.pathToMessages.get(fileName) ?? [];
  }

  get errors(): AbstractCompilationMessage[] {
    return Array.from(this.pathToMessages.values()).flat()
      .filter(it => it.type === MessageType.ERROR);
  }

  assignProgram(program: ts.Program | null): void {
    this._program = program;
  }

  assignContextualFileName(fileName: string | null): void {
    this._contextualFileName = fileName;
  }

  report(message: AbstractCompilationMessage): void {
    const messagesByPath = this.pathToMessages.get(message.contextualFileName) ?? [];
    messagesByPath.push(message);

    if (!this.pathToMessages.has(message.contextualFileName)) {
      this.pathToMessages.set(message.contextualFileName, messagesByPath);
    }
  }

  clearMessagesByFileName(fileName: string): void {
    this.pathToMessages.delete(fileName);
  }

  clear(): void {
    this.pathToMessages.clear();
  }
}
