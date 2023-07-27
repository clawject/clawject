import { IDIConfig } from './IDIConfig';
import { cosmiconfigSync } from 'cosmiconfig';
import { Validator } from 'jsonschema';
import schema from './schema.json';
import { CONSTANTS } from '../../constants';
import { merge } from 'lodash';
import { getCompilationContext } from '../../transformer/getCompilationContext';
import { LanguageService } from '../../lsp/LanguageService';

export class ConfigLoader {
  private static defaultConfig: IDIConfig = {
    mode: 'application',
    unsafeTSVersion: false,
    features: {
      advancedClassTypeResolution: true,
      keepContextNames: true,
    }
  };
  static cachedConfig: IDIConfig | null = null;
  static onConfigLoaded: ((configFilename: string) => void) | null = null;

  static get(): IDIConfig {
    if (this.cachedConfig !== null) {
      return this.cachedConfig;
    }

    const loader = cosmiconfigSync(CONSTANTS.libraryName);

    const loaderResult = loader.search();
    const config: Partial<IDIConfig | null> = loaderResult?.config ?? null;

    if (config === null) {
      this.cachedConfig = this.defaultConfig;

      return this.cachedConfig;
    }

    loaderResult?.filepath && this.onConfigLoaded?.(loaderResult.filepath);
    this.setConfig(config);

    return this.cachedConfig!;
  }

  static setConfig(config: Partial<IDIConfig>): void {
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
