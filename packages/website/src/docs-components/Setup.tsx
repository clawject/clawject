import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { useFormattedCode } from '@site/src/docs-components/useFormattedCode';

export const AddDependency = () => {
  const yarnAddCode = 'yarn add @clawject/di';
  const npmAddCode = 'npm install @clawject/di';

  return (
    <Tabs>
      <TabItem value="yarn" label="yarn" default>
        <CodeBlock showLineNumbers language="bash">
          {yarnAddCode}
        </CodeBlock>
      </TabItem>
      <TabItem value="npm" label="npm">
        <CodeBlock showLineNumbers language="bash">
          {npmAddCode}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export const TSPatchWebpackTSLoader = () => {
  const webpackCode = `
    export default {
      module: {
        rules: [{
          test: /\\.ts$/,
          loader: 'ts-loader',
          options: {
            // This option needed if you have typescript >= 5 and using
            // live-compiler method of ts-patch
            // https://github.com/nonara/ts-patch#method-1-live-compiler
            compiler: 'ts-patch/compiler'
          }
        }]
      }
    };
  `;
  const tsconfigCode = `
    {
      "compilerOptions": {
        "plugins": [
          {
            "transform": "@clawject/di/transformer"
          }
        ]
      }
    }
  `;

  const webpackPatchCode = useFormattedCode(webpackCode, 'typescript');
  const prettyTSConfigCode = useFormattedCode(tsconfigCode, 'json');

  return (
    <Tabs>
      <TabItem value="webpack" label="webpack.config.js" default>
        <CodeBlock showLineNumbers language="typescript">
          {webpackPatchCode}
        </CodeBlock>
      </TabItem>
      <TabItem value="tsconfig" label="tsconfig.json" default>
        <CodeBlock showLineNumbers language="json">
          {prettyTSConfigCode}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export const TSPatchViteRollupPlugin = () => {
  const viteCode = `
    import { defineConfig } from 'vite';
    import typescript from 'rollup-plugin-typescript2';

    export default defineConfig({
      esbuild: false,
      plugins: [
        typescript(),
      ],
    });
  `;
  const tsconfigCode = `
    {
      "compilerOptions": {
        "plugins": [
          {
            "transform": "@clawject/di/transformer"
          }
        ]
      }
    }
  `;

  const prettyViteCode = useFormattedCode(viteCode, 'typescript');
  const prettyTSConfigCode = useFormattedCode(tsconfigCode, 'json');

  return (
    <Tabs>
      <TabItem value="vite" label="vite.config.ts" default>
        <CodeBlock showLineNumbers language="typescript">
          {prettyViteCode}
        </CodeBlock>
      </TabItem>
      <TabItem value="tsconfig" label="tsconfig.json" default>
        <CodeBlock showLineNumbers language="json">
          {prettyTSConfigCode}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};


export const WebpackTSLoader = () => {
  const webpackCode = `
    import { ClawjectTransformer } from '@clawject/di/transformer';
    import { ClawjectWebpackPlugin } from '@clawject/di/webpack'

    export default {
      module: {
        rules: [{
          test: /\\.ts$/,
          loader: 'ts-loader',
          options: {
            getCustomTransformers: (program, getProgram) => ({
              before: [
                ClawjectTransformer(getProgram)
              ]
            })
          }
        }]
      },
      plugins: [
        new ClawjectWebpackPlugin()
      ]
    };
  `;

  const prettyWebpackCode = useFormattedCode(webpackCode, 'typescript');

  return (
    <CodeBlock showLineNumbers title="webpack.config.js" language="typescript">
      {prettyWebpackCode}
    </CodeBlock>
  );
};
