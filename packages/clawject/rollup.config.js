import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
// import noderesolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default {
  input: {
    'index': 'src/index.ts',
    'runtime/___internal___/index': 'src/runtime/___internal___/index.ts',
    // 'lsp': 'src/lsp/index.ts',
    // 'webpack': 'src/webpack/index.ts',
    // 'transformer/index': 'src/transformer/index.ts',
    // 'transformer/metadata': 'src/transformer/metadata.ts',
  },
  external: [
    /node_modules/,
    '@clawject/object-storage'
  ],
  output: {
    dir: 'dist/dist/esm',
    format: 'es',
    preserveModules: true,
  },
  plugins: [typescript(), json()]
};
