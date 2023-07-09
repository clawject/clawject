import { Compilation, Compiler } from 'webpack';
import { getCompilationContext } from '../transformer/getCompilationContext';
import { BuildErrorFormatter } from '../compile-time/compilation-context/BuildErrorFormatter';

const reportDIErrorsHook = (compilation: Compilation) => {
  const compilationContext = getCompilationContext();
  const message = BuildErrorFormatter.formatErrors(
    compilationContext.errors,
  );

  if (message === null) {
    return;
  }

  compilation.errors.push(buildWebpackError(message));
};

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
