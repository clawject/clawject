import ts from 'typescript';
import { MessageType } from './messages/MessageType';
import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';

export class CompilationContext {
  areErrorsHandled = false;
  languageServiceMode = false;
  private messages: AbstractCompilationMessage[] = [];
  private pathToMessages = new Map<string, AbstractCompilationMessage[]>();

  private _program: ts.Program | null = null;

  get program(): ts.Program {
    if (!this._program) {
      throw new Error('ts.Program is not assigned, most likely you didn\'t add transformer to your tsconfig.json or webpack configuragtion');
    }

    return this._program;
  }

  get typeChecker(): ts.TypeChecker {
    return this.program.getTypeChecker();
  }

  get errors(): AbstractCompilationMessage[] {
    return this.messages.filter(it => it.type === MessageType.ERROR);
  }

  assignProgram(program: ts.Program | null): void {
    this._program = program;
  }

  report(message: AbstractCompilationMessage): void {
    this.messages.push(message);

    const messagesByPath = this.pathToMessages.get(message.place.filePath) ?? [];
    messagesByPath.push(message);
    this.pathToMessages.set(message.place.filePath, messagesByPath);
  }

  getMessagesByFileName(fileName: string): AbstractCompilationMessage[] {
    return Array.from(this.messages).filter(it => it.place.filePath === fileName);
  }

  clearMessagesByFileName(fileName: string): void {
    this.messages = this.messages.filter(it => it.place.filePath !== fileName);
    this.pathToMessages.delete(fileName);
  }

  clear(): void {
    this.messages = [];
    this.pathToMessages = new Map<string, AbstractCompilationMessage[]>();
  }
}
