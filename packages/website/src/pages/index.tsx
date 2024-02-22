import React from 'react';
import Layout from '@theme/Layout';
import classNames from 'classnames';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import { TypeAnimation } from 'react-type-animation';
import { sample } from 'lodash';
import { useLocalStorage } from 'usehooks-ts';

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
  'Purr-fect',
  'Paw-some',
  'Feline grace',
].map(it => [it, 3500]).flat();

const SUBTITLE_PHRASES = [
  'Type-safe dependency injection made effortless',
  'Your dependency injection wizard',
  'Compile-time magic – swiftly runtime',
  'Say goodbye to injection tokens',
  'Type-centric: Clawject\'s signature style',
  'Clean code, clear dependencies: Clawject\'s promise',
  'Type-safe, token-free: Clawject\'s hallmark',
  'Type-driven DI: Clawject\'s pledge',
  '„Give me a type, I\'ll give you a dependency“',
  'Curiosity didn\'t kill this cat, it perfected DI',
  'With love from Ukrainian cats 🇺🇦',
  'Cat-egorically efficient',
  'No scratch, just smooth DI',
  'Because cats know best',
  'Sharp claws, sharp DI',
];

const TWO_MINUTES = 60 * 1000 * 2;

export default function Home(): JSX.Element {
  const [lastSloganChange, setLastSloganChange]= useLocalStorage<number | null>('lastSloganChangeDate', null);
  const [lastSloganPhrase, setLastSloganPhrase]= useLocalStorage<string | null>('lastSloganPhrase', sample(SUBTITLE_PHRASES));

  React.useEffect(() => {
    if (lastSloganChange === null) {
      setLastSloganChange(Date.now());
      sample(SUBTITLE_PHRASES);
    }

    if (lastSloganChange + TWO_MINUTES < Date.now()) {
      setLastSloganChange(Date.now());
      setLastSloganPhrase(sample(SUBTITLE_PHRASES));
    }
  }, [lastSloganChange]);

  return (
    <Layout
      description="TypeScript Dependency Injection Framework"
    >
      <div className={classNames('hero', styles.heroContainer)}>

        <div className={styles.contentContainer}>
          <h1 className={classNames('hero__title')}>Clawject</h1>
          <p className={classNames('hero__subtitle', styles.heroSubtitle)}>
            {lastSloganPhrase}
          </p>
          <TypeAnimation preRenderFirstString sequence={WORDS} speed={10} repeat={Infinity}
            className={styles.typeAnimation}/>
          <Link className={classNames('button button--primary button--outline button--lg')} to="/docs">
              Get Started
          </Link>
        </div>

        <div className={classNames(styles.logoContainer, 'margin-top--lg')}>
          <div className={styles.logoBackground}/>
          <img className={classNames(styles.logo)} src="/img/logo.svg" alt="Clawject"/>
        </div>
      </div>

      {/*<div className="container margin-top--md">*/}
      {/*  <div className="row">*/}

      {/*    <div className={classNames('col col--4','margin-bottom--lg', 'col--offset-2')}>*/}
      {/*      <div className={classNames('card', 'padding--lg', styles.card)}>*/}
      {/*          Test*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className={classNames('col col--4', 'margin-bottom--lg')}>*/}
      {/*      <div className={classNames('card', 'padding--lg', styles.card)}>*/}
      {/*        Test*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*  </div>*/}
      {/*</div>*/}

    </Layout>
  );
}
