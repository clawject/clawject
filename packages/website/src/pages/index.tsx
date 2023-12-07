import React from 'react';
import Layout from '@theme/Layout';
import classNames from 'classnames';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import { TypeAnimation } from 'react-type-animation';

const WORDS = [
  'Declarative',
  'Intuitive',
  'External',
  'Lightweight',
  'Adaptive',
  'Easy-to-use',
  'Resourceful',
  'Far-sighted',
  'Well-prepared',
  'Sagacious',
  'Innovative',
].map(it => [it, 3500]).flat();

export default function Home(): JSX.Element {
  return (
    <Layout
      description="TypeScript Dependency Injection Framework"
    >
      <main>
        <div className={classNames('hero', styles.hero)}>

          <div className={styles.contentContainer}>
            <h1 className={classNames('hero__title')}>Clawject</h1>
            <p className="hero__subtitle">TypeScript powered DI framework</p>
            <TypeAnimation preRenderFirstString sequence={WORDS} speed={10} repeat={Infinity} className={styles.typeAnimation} />
            <Link className={classNames('button button--primary button--outline button--lg')} to="/docs">
                  Get Started
            </Link>
          </div>

          <div className={classNames(styles.logoContainer)}>
            <div className={styles.logoBackground} />
            <img className={classNames(styles.logo)} src="/img/logo.svg" alt="Clawject" />
          </div>
        </div>
      </main>
    </Layout>
  );
}
