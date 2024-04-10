import * as webpackModule from '@clawject/core/webpack';
import { Compiler } from 'webpack';

/** @public */
export class ClawjectWebpackPlugin {
  apply(compiler: Compiler) {
    const ClawjectWebpackPlugin = new webpackModule.ClawjectWebpackPlugin();

    return ClawjectWebpackPlugin.apply(compiler);
  }
}
