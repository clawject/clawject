import React from 'react';
import Layout from '@theme/Layout';

import styles from './playground.module.css';

export const Playground = () => {
  return (
    <Layout
      noFooter
      title="Playground"
      description="Try out clawject right in your browser"
      wrapperClassName={styles.playground}
    >
    </Layout>
  );
};
