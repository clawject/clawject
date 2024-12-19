import type ts from 'typescript';
import { UnpluginMessage } from 'unplugin';
import { DiagnosticsBuilder } from '@clawject/core/ts-diagnostics/DiagnosticsBuilder';
import { Context } from '@clawject/core/compilation-context/Context';
import { AbstractCompilationMessage } from '@clawject/core/compilation-context/messages/AbstractCompilationMessage';

export class ErrorsReporter {
  reportErrors(cb: (message: UnpluginMessage) => void): void {
    const errors = this.getErrorsAndClear();

    errors.forEach(it => {
      cb(it);
    });
  }

  private getErrorsAndClear(): UnpluginMessage[] {
    const errors = Array.from(Context.errors);
    Context.clearMessages();
    const diagnostics = this.getDiagnostics(errors);

    return diagnostics.map(it => this.transformDiagnostic(it));
  }

  private getDiagnostics(messages: AbstractCompilationMessage[]): ts.Diagnostic[] {
    return this.compact(messages.map(it => DiagnosticsBuilder.compilationMessageToDiagnostic(it)));
  }

  private transformDiagnostic(diagnostic: ts.Diagnostic): UnpluginMessage {
    const loc = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0);

    return {
      plugin: 'clawject-unplugin',
      message: DiagnosticsBuilder.diagnosticsToString([diagnostic]),
      pluginCode: diagnostic.code,
      loc: loc ? {
        file: diagnostic.file?.fileName,
        line: loc.line + 1,
        column: loc.character,
      } : undefined
    };
  }

  private compact<T>(array: (T | undefined | null)[]): T[] {
    return array.filter(it => it !== undefined && it !== null) as T[];
  }
}
