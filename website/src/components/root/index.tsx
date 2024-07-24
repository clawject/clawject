import classNames from 'classnames';
import styles from '@site/src/pages/index.module.css';
import { TypeAnimation } from 'react-type-animation';
import Link from '@docusaurus/Link';
import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { useColorMode } from '@docusaurus/theme-common';
import { ICodeDiagnostic } from '@site/src/components/CodeBlockWithDiagnostics/types';
import CodeBlock from '@theme/CodeBlock';
import { CodeBlockWithDiagnostics } from '@site/src/components/CodeBlockWithDiagnostics';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

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

export const diagnosticsCode = `
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
export const diagnosticsMessages: ICodeDiagnostic[] = [
  {
    line: 2,
    start: 24,
    width: 18,
    highlightedRangeClassName: 'textDecorationError',
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
        link: 'main.ts(15,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
  {
    line: 19,
    start: 2,
    width: 16,
    highlightedRangeClassName: 'textDecorationError',
    message: 'CE4: Can not register Bean.',
    relatedDiagnostics: [
      {
        link: 'main.ts(2,25)',
        message: 'Cannot find a Bean candidate for \'someString\'.'
      },
      {
        link: 'main.ts(15,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
  {
    line: 21,
    start: 2,
    width: 16,
    highlightedRangeClassName: 'textDecorationError',
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
        link: 'main.ts(15,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
  {
    line: 25,
    start: 25,
    width: 4,
    highlightedRangeClassName: 'textDecorationError',
    message: 'CE8: Incorrect type. Type \'void\' not supported as a Bean type.',
    relatedDiagnostics: [
      {
        link: 'main.ts(15,7)',
        highlightedPrefix: 'Application',
        message: 'is declared here.'
      }
    ]
  },
];

const configurationsCode = `
@Configuration
class PetsConfiguration {
  catRepository = Bean(Repository<Cat>);
  dogRepository = Bean(Repository<Dog>);
  foxRepository = Bean(Repository<Fox>);

  catService = Bean(Service<Cat>);
  dogService = Bean(Service<Dog>);
  foxService = Bean(Service<Fox>);

  @External petService = Bean(PetService);
}
`.trim();
const configurationsMessages: ICodeDiagnostic[] = [
  {
    line: 1,
    start: 0,
    width: 14,
    highlightedRangeClassName: 'textDecorationInfo',
    message: 'Use @Configuration decorator to define single configuration',
    relatedDiagnostics: []
  },
  {
    line: 11,
    start: 2,
    width: 9,
    highlightedRangeClassName: 'textDecorationInfo',
    message: 'Specify visibility of beans outside of configuration class',
    relatedDiagnostics: []
  },
];

const externalizeIOCCode = `
@Injectable()
class PetService {
  constructor(/* ... */) {}
}

@Configuration
class PetConfiguration {
  petService = Bean(PetService);
  /* ... */
}
`.trim();
const externalizeIOCMessages: ICodeDiagnostic[] = [
  {
    line: 1,
    start: 0,
    width: 13,
    highlightedRangeClassName: 'textDecorationLineThroughRed',
    relatedDiagnostics: []
  },
];

const firstClassTypeSafetyCode = `
@Injectable()
class CatService {
  constructor(
    @Inject(InjectionTokens.NotCatRepository)
    private catRepository: Repository<Cat>
  ) {}
}
`.trim();
const firstClassTypeSafetyMessages: ICodeDiagnostic[] = [
  {
    line: 1,
    start: 0,
    width: 13,
    highlightedRangeClassName: 'textDecorationLineThroughRed',
    relatedDiagnostics: []
  },
  {
    line: 4,
    start: 4,
    width: 41,
    message: 'Oops, wrong injection token. Clawject will inject dependencies only by type, so type safety is guaranteed',
    highlightedRangeClassName: 'textDecorationError',
    relatedDiagnostics: []
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
            <p>
              It's not only about the amount of code you write, but also about the clarity and readability of your code.
              Imagine how much time Clawject can save you.
              All this time can be used for more important things, like playing with your cat 🐈
            </p>
          </div>

          <div className="col col--6">
            <CodeBlock showLineNumbers title="Develop with other popular framework" language="ts">
              {otherFrameworkCode}
            </CodeBlock>
          </div>

        </div>

        <div className="row margin-top--lg">

          <div className="col">
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
              language="ts"
              diagnostics={diagnosticsMessages}
            >
              {diagnosticsCode}
            </CodeBlockWithDiagnostics>
          </div>

        </div>

        <div className="row margin-top--lg">

          <div className="col">
            <h2 className={classNames(styles.textGradient)}>
              Split your code by features
            </h2>

            <p>
              Using @Configuration classes you can split your code by features.
              Encapsulate beans and expose only needed to the container.
              It will help you to keep your codebase clean and maintainable.
            </p>
          </div>

          <div className="col">
            <CodeBlockWithDiagnostics
              showLineNumbers
              language="ts"
              diagnostics={configurationsMessages}
            >
              {configurationsCode}
            </CodeBlockWithDiagnostics>
          </div>

        </div>

        <div className="row margin-top--lg">

          <div className="col">
            <h2 className={classNames(styles.textGradient)}>
              Externalize inversion of control
            </h2>

            <p>
              Forgot about tons of decorators on your business logic classes,
              with Clawject you can externalize inversion of control and keep your classes clean, readable
              and focused on business logic.
            </p>
          </div>

          <div className="col">
            <CodeBlockWithDiagnostics
              showLineNumbers
              language="ts"
              diagnostics={externalizeIOCMessages}
            >
              {externalizeIOCCode}
            </CodeBlockWithDiagnostics>
          </div>

        </div>

        <div className="row margin-top--lg">

          <div className="col">
            <h2 className={classNames(styles.textGradient)}>
              First class type safety
            </h2>

            <p>
              With Clawject - you will never have to worry about the injection tokens mismatch, type - is a source of truth.
              Stop defining complex factory providers just because you want to use interfaces or generics –
              Clawject will take care of it for you.
            </p>
          </div>

          <div className="col">
            <CodeBlockWithDiagnostics
              showLineNumbers
              language="ts"
              diagnostics={firstClassTypeSafetyMessages}
            >
              {firstClassTypeSafetyCode}
            </CodeBlockWithDiagnostics>
          </div>

        </div>
      </div>

    </ConfigProvider>
  );
};
