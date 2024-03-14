import classNames from 'classnames';
import styles from '@site/src/pages/index.module.css';
import { TypeAnimation } from 'react-type-animation';
import Link from '@docusaurus/Link';
import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { useColorMode } from '@docusaurus/theme-common';
import { ICodeDiagnostic } from '@site/src/components/CodeBlock/types';
import CodeBlock from '@theme/CodeBlock';
import { CodeBlockWithDiagnostics } from '@site/src/components/CodeBlock/index';

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

const clawjectCode =
  `
interface IRepository<T> { /*...*/ }
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
class PrimitivesService {
  constructor(
    private stringRepository: IRepository<string>,
    private numberRepository: IRepository<number>,
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@ClawjectApplication
class Application {
  stringRepository = Bean(RepositoryImpl<string>);
  numberRepository = Bean(RepositoryImpl<number>);
  booleanRepository = Bean(RepositoryImpl<boolean>);
  primitivesService = Bean(PrimitivesService);
}
`.trim();
const otherFrameworkCode =
  `
interface IRepository<T> { /*...*/ }
@Injectable()
class RepositoryImpl<T> implements IRepository<T> { /*...*/ }
const InjectionTokens = {
  StringRepository: Symbol('StringRepository'),
  NumberRepository: Symbol('NumberRepository'),
  BooleanRepository: Symbol('BooleanRepository'),
}

@Injectable()
class PrimitivesService {
  constructor(
    @Inject(InjectionTokens.StringRepository)
    private stringRepository: IRepository<string>,
    @Inject(InjectionTokens.NumberRepository)
    private numberRepository: IRepository<number>,
    @Inject(InjectionTokens.BooleanRepository)
    private booleanRepository: IRepository<boolean>,
  ) {}
}

@Module({
  providers: [
    PrimitivesService,
    {
      provide: InjectionTokens.StringRepository,
      useClass: RepositoryImpl,
    },
    {
      provide: InjectionTokens.NumberRepository,
      useClass: RepositoryImpl,
    },
    {
      provide: InjectionTokens.BooleanRepository,
      useClass: RepositoryImpl,
    },
  ],
})
class Application {}
`.trim();

const diagnosticsCode = `
class Foo {
  constructor(baz: Baz, someString: string) {}
}
class Bar {
  constructor(private quux: Quux) {}
}
class Baz {
  constructor(private bar: Bar) {}
}
class Quux {
  constructor(private baz: Baz) {}
}

@ClawjectApplication
class Application {
  @Bean string1 = 'string1';
  @Bean string2 = 'string2';

  foo = Bean(Foo);
  bar = Bean(Bar);
  baz = Bean(Baz);
  quux = Bean(Quux);

  @Bean
  beanThatReturnsVoid(): void {}
}
`.trim();
const diagnosticsMessages: ICodeDiagnostic[] = [
  {
    line: 2,
    start: 24,
    width: 18,
    level: 'error',
    message: 'CE5: Could not qualify bean candidate. Found 2 injection candidates.',
    relatedDiagnostics: [
      {
        link: 'main.ts(16,3)',
        highlightedPrefix: 'string1',
        message: 'matched by type.'
      },
      {
        link: 'main.ts(17,3)',
        highlightedPrefix: 'string2',
        message: 'matched by type.'
      },
      {
        link: 'main.ts(19,3)',
        highlightedPrefix: 'foo',
        message: 'is declared here.'
      },
      {
        link: 'main.ts(17,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
  {
    line: 19,
    start: 2,
    width: 16,
    level: 'error',
    message: 'CE4: Can not register Bean.',
    relatedDiagnostics: [
      {
        link: 'main.ts(2,25)',
        message: 'Cannot find a Bean candidate for \'someString\'.'
      },
      {
        link: 'main.ts(17,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
  {
    line: 21,
    start: 2,
    width: 16,
    level: 'error',
    message: 'CE7: Circular dependencies detected. baz → bar → quux → baz',
    relatedDiagnostics: [
      {
        link: 'main.ts(20,3)',
        highlightedPrefix: 'bar',
        message: 'is declared here.'
      },
      {
        link: 'main.ts(22,3)',
        highlightedPrefix: 'quux',
        message: 'is declared here.'
      },
      {
        link: 'main.ts(17,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
  {
    line: 25,
    start: 25,
    width: 4,
    level: 'error',
    message: 'CE8: Incorrect type. Type \'void\' not supported as a Bean type.',
    relatedDiagnostics: [
      {
        link: 'main.ts(17,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
];

export const Index = () => {
  const {colorMode} = useColorMode();

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

      <div className="container margin-top--lg">
        <div className="row">
          <div className="col">
            <h1 className={classNames(styles.textGradient)}>
              Built for developers convenience
            </h1>
            <p>
              Clawject designed to make dependency injection and inversion of control in TypeScript as effortless,
              clear and intuitive as possible.
              <br/>
              It allows define class dependencies in a declarative way, without the need to use injection tokens or any
              other boilerplate,
              especially when it comes to interfaces and generics.
            </p>
          </div>
        </div>

        <div className="row">

          <div className="col col--6">
            <CodeBlock showLineNumbers title="Develop with Clawject" language="ts">
              {clawjectCode}
            </CodeBlock>
          </div>

          <div className="col col--6">
            <CodeBlock showLineNumbers title="Develop with other popular framework" language="ts">
              {otherFrameworkCode}
            </CodeBlock>
          </div>

        </div>

        <div className="row margin-top--lg">

          <div className="col col--5">
            <h2 className={classNames(styles.textGradient)}>
              In-editor diagnostics support
            </h2>

            <p>
              With Clawject's language service plugin,
              you can get instant feedback about missing beans, incorrect types, circular dependencies and more.
              It will help you to catch errors early without running your application and make your development process
              more productive.
            </p>
          </div>

          <div className="col">
            <CodeBlockWithDiagnostics
              showLineNumbers
              title="main.ts"
              language="ts"
              diagnostics={diagnosticsMessages}
            >
              { diagnosticsCode }
            </CodeBlockWithDiagnostics>
          </div>

        </div>
      </div>

    </ConfigProvider>
  );
};
