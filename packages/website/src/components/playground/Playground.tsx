import React from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import Layout from '@theme/Layout';

import styles from './playground.module.css';

export const Playground = () => {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (!monaco) {
      return;
    }

    // monaco.editor.createModel();
    // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    //   lib: ['esnext', 'dom'],
    // });
    //
    // console.log(monaco.languages.typescript.typescriptDefaults.addExtraLib());
  }, [monaco]);


  return (
    <Layout
      noFooter
      title="Playground"
      description="Try out clawject right in your browser"
      wrapperClassName={styles.playground}
    >
      <Editor theme="vs-dark" height="unset" language="typescript"/>
    </Layout>
  );
};
