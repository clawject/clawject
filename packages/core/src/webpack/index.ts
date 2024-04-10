import { Compilation, Compiler } from 'webpack';
import { compact } from 'lodash';
import { DiagnosticsBuilder } from '../ts-diagnostics/DiagnosticsBuilder';
import { Context } from '../compilation-context/Context';

const reportDIErrorsHook = (compilation: Compilation) => {
  const errors = Context.errors;

  if (errors.length === 0) {
    return;
  }

  const mapped = compact(errors.map(it => DiagnosticsBuilder.compilationMessageToDiagnostic(it)));
  const formatted = DiagnosticsBuilder.diagnosticsToString(mapped);

  compilation.errors.push(formatted as any);
};

/** @public */
export class ClawjectWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.afterEnvironment.tap(ClawjectWebpackPlugin.name, () => {
      Context.areErrorsHandled = true;
    });
    compiler.hooks.afterEmit.tap(ClawjectWebpackPlugin.name, reportDIErrorsHook);
  }
}

function buildWebpackError(message: string): any {
  return new Error(message) as any;
}
