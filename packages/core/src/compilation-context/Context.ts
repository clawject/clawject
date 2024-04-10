import * as ts from 'typescript';
import { MessageType } from './messages/MessageType';
import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';

export class Context {
  static areErrorsHandled = false;
  static languageServiceMode = false;
  private static _contextualFileName: string | null = null;
  private static _cancellationToken: () => boolean = () => false;
  private static pathToMessages = new Map<string, AbstractCompilationMessage[]>();

  private static _program: ts.Program | null = null;
  private static _factory: ts.NodeFactory | null = null;

  static ts: typeof ts = ts;

  static get program(): ts.Program {
    if (!this._program) {
      throw new Error('Program is not assigned, most likely you didn\'t add transformer to your tsconfig.json or webpack configuragtion');
    }

    return this._program;
  }

  static get factory(): ts.NodeFactory {
    if (!this._factory) {
      throw new Error('Factory is not assigned, it is an internal error, please report it on github');
    }

    return this._factory;
  }

  static get typeChecker(): ts.TypeChecker {
    return this.program.getTypeChecker();
  }

  static get contextualFileName(): string {
    if (!this._contextualFileName) {
      throw new Error('Current file is not assigned in compilation context, it is an internal error, please report it on github https://github.com/clawject/clawject/issues/new.');
    }

    return this._contextualFileName;
  }

  static isCancellationRequested(): boolean {
    return this._cancellationToken() ?? false;
  }

  static getAllMessages(): AbstractCompilationMessage[] {
    return Array.from(this.pathToMessages.values()).flat();
  }

  static getMessages(fileName: string): AbstractCompilationMessage[] {
    return this.pathToMessages.get(fileName) ?? [];
  }

  static get errors(): AbstractCompilationMessage[] {
    return Array.from(this.pathToMessages.values()).flat()
      .filter(it => it.type === MessageType.ERROR);
  }

  static assignProgram(program: ts.Program | null): void {
    this._program = program;
  }

  static assignFactory(factory: ts.NodeFactory | null): void {
    this._factory = factory;
  }

  static assignCancellationToken(token: () => boolean): void {
    this._cancellationToken = token;
  }

  static assignContextualFileName(fileName: string | null): void {
    this._contextualFileName = fileName;
  }

  static report(message: AbstractCompilationMessage): void {
    const messagesByPath = this.pathToMessages.get(message.contextualFileName) ?? [];
    messagesByPath.push(message);

    if (!this.pathToMessages.has(message.contextualFileName)) {
      this.pathToMessages.set(message.contextualFileName, messagesByPath);
    }
  }

  static clearMessagesByFileName(fileName: string): void {
    this.pathToMessages.delete(fileName);
  }

  static clear(): void {
    this.pathToMessages.clear();
  }
}
