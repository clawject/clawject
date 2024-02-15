import { Compilation, Compiler } from 'webpack';
import { getCompilationContext } from '../transformer/getCompilationContext';
import { DiagnosticsBuilder } from '../compile-time/ts-diagnostics/DiagnosticsBuilder';

const reportDIErrorsHook = (compilation: Compilation) => {
  const errors = getCompilationContext().errors;

  if (errors.length === 0) {
    return;
  }

  const mapped = errors.map(it => DiagnosticsBuilder.compilationMessageToDiagnostic(it));
  const formatted = DiagnosticsBuilder.diagnosticsToString(mapped);

  compilation.errors.push(formatted as any);
};

/** @public */
export class ClawjectWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEnvironment.tap(ClawjectWebpackPlugin.name, () => {
      getCompilationContext().areErrorsHandled = true;
    });
    compiler.hooks.afterEmit.tap(ClawjectWebpackPlugin.name, reportDIErrorsHook);
  }
}

function buildWebpackError(message: string): any {
  return new Error(message) as any;
}
