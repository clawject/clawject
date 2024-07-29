import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import missingArguments from './missingArguments.json';
import notStaticallyKnown from './notStaticallyKnown.json';

describe('DecoratorError', () => {
  const compiler = new Compiler();

  describe.each`
    decoratorsCount
    ${2}
    ${3}
    ${4}
    ${5}
  `('should report DecoratorError, decoratorsCount: $decoratorsCount', ({ decoratorsCount }) => {
    it.each`
        decoratorName      | expectedStart
        ${'Bean'}          | ${109}
        ${'PreDestroy'}    | ${115}
        ${'Embedded'}      | ${113}
        ${'Lazy'}          | ${109}
        ${'PostConstruct'} | ${118}
        ${'Scope'}         | ${110}
        ${'Primary'}       | ${112}
        ${'Qualifier'}     | ${114}
    `('decoratorName: $decoratorName, expectedStart: $expectedStart', ({ decoratorName, expectedStart }) => {
      //Given
      const fileContent = getFile(__dirname, 'duplicateDecorators.ts', {
        decoratorName,
        decoratorExpression: Array(decoratorsCount).fill(`@${decoratorName}`).join(' '),
      });
      compiler.loadFile('/index.ts', fileContent);

      //When
      const diagnostics = compiler.getDiagnostics();

      //Then
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0].messageText).toEqual(`Decorator error. @${decoratorName} from '@clawject/di' can not be used multiple times.`);
      expect(diagnostics[0].start).toEqual(expectedStart);
      expect(diagnostics[0].file?.fileName).toEqual('/index.ts');
      expect(diagnostics[0].source).toEqual('CE2');
    });
  });

  it('should report when arguments are missing', () => {
    //Given
    const fileContent = getFile(__dirname, 'missingArguments.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE2');

    matchDiagnostics(searchedDiagnostic, missingArguments);
  });

  it('should report when arguments are not statically knwon', () => {
    //Given
    const fileContent = getFile(__dirname, 'notStaticallyKnown.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE2');

    matchDiagnostics(searchedDiagnostic, notStaticallyKnown);
  });
});
