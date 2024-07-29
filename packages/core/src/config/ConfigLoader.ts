import { DIConfig } from './DIConfig';
import { cosmiconfigSync } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import { Validator } from 'jsonschema';
import schema from './schema.json';
import { merge } from 'lodash';
import { Context } from '../compilation-context/Context';
import * as process from 'node:process';

export class ConfigLoader {
  private static defaultConfig: DIConfig = {
    unsafeTSVersion: false,
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
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

  static configFileErrors: string[] = [];

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
      throwError: !Context.languageServiceMode,
    });

    this.configFileErrors = validatorResult.errors.map(it => it.toString());
    this.cachedConfig = merge(this.defaultConfig, config);
  }

  static clear(): void {
    this.cachedConfig = null;
    this.configFileErrors = [];
  }
}
