import { IDIConfigFull } from './IDIConfigFull';
import { cosmiconfigSync } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import { Validator } from 'jsonschema';
import schema from './schema.json';
import { getCompilationContext } from '../../transformer/getCompilationContext';
import { LanguageService } from '../../lsp/LanguageService';
import { merge } from 'lodash';

export class ConfigLoader {
  private static defaultConfig: IDIConfigFull = {
    mode: 'atomic',
    unsafeTSVersion: false,
    features: {
      advancedClassTypeResolution: true,
      keepContextNames: true,
    }
  };
  static cachedConfig: IDIConfigFull | null = null;
  static onConfigLoaded: ((configFilename: string) => void) | null = null;

  static get(): IDIConfigFull {
    if (this.cachedConfig !== null) {
      return this.cachedConfig;
    }

    const loader = cosmiconfigSync('clawject', {
      loaders: {
        '.ts': TypeScriptLoader(),
      }
    });

    const loaderResult = loader.search();
    const config: Partial<IDIConfigFull | null> = loaderResult?.config ?? null;

    if (config === null) {
      this.cachedConfig = this.defaultConfig;

      return this.cachedConfig;
    }

    loaderResult?.filepath && this.onConfigLoaded?.(loaderResult.filepath);
    this.setConfig(config);

    return this.cachedConfig!;
  }

  static setConfig(config: Partial<IDIConfigFull>): void {
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
