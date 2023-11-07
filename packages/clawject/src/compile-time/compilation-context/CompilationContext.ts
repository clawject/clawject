import ts from 'typescript';
import { MessageType } from './messages/MessageType';
import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';

export class CompilationContext {
  areErrorsHandled = false;
  languageServiceMode = false;
  currentlyProcessedFile: string | null = null;
  private _messages: AbstractCompilationMessage[] = [];
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

  get messages(): AbstractCompilationMessage[] {
    return this._messages;
  }

  get errors(): AbstractCompilationMessage[] {
    return this._messages.filter(it => it.type === MessageType.ERROR);
  }

  assignProgram(program: ts.Program | null): void {
    this._program = program;
  }

  assignCurrentlyProcessedFileName(fileName: string | null): void {
    this.currentlyProcessedFile = fileName;
  }

  report(message: AbstractCompilationMessage): void {
    this._messages.push(message);

    const messagesByPath = this.pathToMessages.get(message.place.filePath) ?? [];
    messagesByPath.push(message);
    this.pathToMessages.set(message.place.filePath, messagesByPath);
  }

  clearMessagesByFileName(fileName: string): void {
    this._messages = this._messages.filter(it => it.place.filePath !== fileName);
    this.pathToMessages.delete(fileName);
  }

  clearByProcessingFileName(fileName: string): void {
    this._messages = this._messages
      .filter(it => it.createdDuringProcessingFileFileName !== fileName);
  }

  clear(): void {
    this._messages = [];
    this.pathToMessages = new Map<string, AbstractCompilationMessage[]>();
  }
}
