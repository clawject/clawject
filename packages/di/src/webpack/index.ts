import type { Compiler } from 'webpack';
import { unpluginFactory } from '../unplugin/index';
import { createWebpackPlugin } from 'unplugin';

/**
 * @deprecated This class will be removed in the next major release, please use @clawject/di/unplugin instead
 *
 * @public
 * */
export class ClawjectWebpackPlugin {
  constructor() {
    return createWebpackPlugin(unpluginFactory);
  }

  apply(compiler: Compiler) {

  }
}
