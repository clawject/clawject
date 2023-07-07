import ts from 'typescript';
import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';
import { MessageType } from './messages/MessageType';

export class CompilationContext {
    areErrorsHandled = false;

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

    assignProgram(program: ts.Program): void {
        this._program = program;
    }

    messages = new Set<AbstractCompilationMessage>();

    get errors(): AbstractCompilationMessage[] {
        return Array.from(this.messages.values()).filter(it => it.type === MessageType.ERROR);
    }

    report(message: AbstractCompilationMessage): void {
        this.messages.add(message);
    }

    clearMessagesByFilePath(path: string): void {
        this.messages.forEach(it => {
            if (it.filePath === path) {
                this.messages.delete(it);
            }
        });
    }
}
