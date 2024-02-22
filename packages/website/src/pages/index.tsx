import React from 'react';
import Layout from '@theme/Layout';
import classNames from 'classnames';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import { TypeAnimation } from 'react-type-animation';
import { sample } from 'lodash';

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

export default function Home(): JSX.Element {

  return (
    <Layout
      description="TypeScript Dependency Injection Framework"
    >
      123
    </Layout>
  );
}
