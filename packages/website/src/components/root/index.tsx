import classNames from 'classnames';
import styles from '@site/src/pages/index.module.css';
import { TypeAnimation } from 'react-type-animation';
import Link from '@docusaurus/Link';
import { CodePreview } from '@site/src/components/code-preview/index';
import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { useColorMode } from '@docusaurus/theme-common';

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
].map(it => [it, 4000]).flat();

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


export const Index = () => {
  const code = `
class Foo {
  constructor(private bar: Bar) {}
}
class Bar {
  constructor(private foo: Foo) {}
}

@ClawjectApplication
class ApplicationContext {
  foo = Bean(Foo);
  bar = Bean(Bar);
}
`.trim();

  const { colorMode } = useColorMode();


  return (
    <ConfigProvider
      theme={{
        algorithm: colorMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Popover: {
            colorBgElevated: 'var(--code-message-background)',
            borderRadiusLG: 4
          }
        }
      }}
    >
      <div className={classNames('hero', styles.heroContainer)}>

        <div className={styles.contentContainer}>
          <h1 className={classNames('hero__title', styles.heroTitle, styles.textGradient)}>
            Clawject
          </h1>
          <p className={classNames('hero__subtitle', styles.heroSubtitle)}>
            Full-stack, type-safe, declarative Dependency Injection framework for TypeScript
          </p>
          {/*<p className={classNames('hero__subtitle')}>*/}
          {/*  {subtitleRandom}*/}
          {/*</p>*/}
          <TypeAnimation
            preRenderFirstString
            sequence={WORDS}
            speed={10}
            repeat={Infinity}
            className={styles.typeAnimation}
          />
          <Link className={classNames('button button--primary button--outline')} to="/docs">
            Get Started
          </Link>
        </div>

        <div className={classNames(styles.logoContainer, 'margin-top--lg')}>
          <div className={classNames(styles.logoBackground)}/>
          <img className={classNames(styles.logo)} src="/img/logo.svg" alt="Clawject"/>
        </div>
      </div>

      {/*<CodePreview*/}
      {/*  code={code}*/}
      {/*  messages={[*/}
      {/*    {*/}
      {/*      level: 'error',*/}
      {/*      line: 10,*/}
      {/*      start: 2,*/}
      {/*      width: 3,*/}
      {/*      message: 'CE7: Circular dependencies detected. foo → bar → foo'*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*/>*/}

    </ConfigProvider>
  );
};
