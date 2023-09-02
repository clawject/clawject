import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LogoBig from '@site/static/img/logo-big.svg';

import styles from './index.module.css';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={styles.homepageHeader}>
      <LogoBig className={styles.logo}/>
      <div className={styles.logo}></div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      description="TypeScript Dependency Injection Framework"
    >
      <HomepageHeader/>
      <main>
      </main>
    </Layout>
  );
}
