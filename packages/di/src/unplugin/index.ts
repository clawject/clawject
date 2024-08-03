import { createUnplugin, UnpluginContextMeta, UnpluginFactory } from 'unplugin';
import { Options, resolveOptions } from './types';
import { createFilter } from '@rollup/pluginutils';
import { PluginCompiler } from './core/PluginCompiler';
import { ProgramStorage } from './core/ProgramStorage';
import { ErrorsReporter } from './core/ErrorsReporter';
import WebpackError from 'webpack/lib/WebpackError';
import { Context } from '@clawject/core/compilation-context/Context';

const excludedFrameworksForReportingErrorsDuringTransform = new Set<UnpluginContextMeta['framework']>([
  'webpack',
  'rspack'
]);

export const unpluginFactory: UnpluginFactory<Options | undefined> = (maybeOptions, meta) => {
  const options = resolveOptions(maybeOptions);
  const filter = createFilter(options.include, options.exclude);

  const errorsReporter = new ErrorsReporter();
  const programStorage = new ProgramStorage(options);
  const pluginCompiler = new PluginCompiler(programStorage);
  Context.areErrorsHandled = true;

  const enforce = options.skipCompilation ? 'post' : 'pre';

  return {
    name: 'clawject-unplugin',
    enforce,
    transformInclude(id) {
      return filter(id);
    },
    async transform(source, id) {
      const reportErrorsCallback = this.error.bind(this);
      const reportErrors = () => {
        if (!excludedFrameworksForReportingErrorsDuringTransform.has(meta.framework)) {
          errorsReporter.reportErrors(reportErrorsCallback);
        }
      };

      if (options.skipCompilation) {
        reportErrors();
        return null;
      }

      const result = await pluginCompiler.transform(id, source);
      reportErrors();

      return result;
    },
    async watchChange(id, event) {
      if (event.event === 'delete') {
        await programStorage.deleteFile(id);
      }
    },
    webpack(compiler) {
      compiler.hooks.afterEmit.tap('clawject-unplugin', async (compilation) => {
        errorsReporter.reportErrors(error => {
          compilation.errors.push(new WebpackError(error.message));
        });
      });
    },
    rspack(compiler) {
      compiler.hooks.afterEmit.tap('clawject-unplugin', async (compilation) => {
        errorsReporter.reportErrors(error => {
          compilation.errors.push(new WebpackError(error.message));
        });
      });
    }
  };
};

/** @public */
export const unplugin = createUnplugin(unpluginFactory);

/** @public */
export default unplugin;
