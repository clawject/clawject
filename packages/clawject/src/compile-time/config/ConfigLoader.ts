import { DIConfig } from './DIConfig';
import { cosmiconfigSync } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import { Validator } from 'jsonschema';
import schema from './schema.json';
import { getCompilationContext } from '../../transformer/getCompilationContext';
import { LanguageService } from '../../lsp/LanguageService';
import { merge } from 'lodash';

export class ConfigLoader {
  private static defaultConfig: DIConfig = {
    unsafeTSVersion: false,
    typeSystem: 'nominal',
    beans: {
      defaultExternal: true,
    },
    imports: {
      defaultExternal: true,
    },
    logLevel: 'error',
  };
  static cachedConfig: DIConfig | null = null;
  static onConfigLoaded: ((configFilename: string) => void) | null = null;

  static get(): DIConfig {
    if (this.cachedConfig !== null) {
      return this.cachedConfig;
    }

    const loader = cosmiconfigSync('clawject', {
      loaders: {
        '.ts': TypeScriptLoader(),
      }
    });

    const loaderResult = loader.search();
    const config: Partial<DIConfig | null> = loaderResult?.config ?? null;

    if (config === null) {
      this.cachedConfig = this.defaultConfig;

      return this.cachedConfig;
    }

    loaderResult?.filepath && this.onConfigLoaded?.(loaderResult.filepath);
    this.setConfig(config);

    return this.cachedConfig!;
  }

  static setConfig(config: Partial<DIConfig>): void {
    const validator = new Validator();

    const validatorResult = validator.validate(config, schema, {
      throwError: !getCompilationContext().languageServiceMode,
    });

    validatorResult.errors.map(it => {
      LanguageService.configFileErrors.push(it.toString());
    });

    this.cachedConfig = merge(this.defaultConfig, config);
  }

  static clear(): void {
    this.cachedConfig = null;
  }
}
