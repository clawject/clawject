import * as ts from 'typescript';
import { MessageType } from './messages/MessageType';
import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';

export class Context {
  static areErrorsHandled = false;
  static languageServiceMode = false;
  private static _cancellationToken = () => false;
  private static messages: AbstractCompilationMessage[] = [];

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

  static isCancellationRequested(): boolean {
    return this._cancellationToken() ?? false;
  }

  static getAllMessages(): AbstractCompilationMessage[] {
    return this.messages;
  }

  static get errors(): AbstractCompilationMessage[] {
    return this.messages
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

  static report(message: AbstractCompilationMessage): void {
    this.messages.push(message);
  }

  static clearMessages(): void {
    this.messages = [];
  }
}
