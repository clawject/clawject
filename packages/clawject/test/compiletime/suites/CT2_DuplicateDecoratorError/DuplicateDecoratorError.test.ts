import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';

describe('DuplicateDecoratorError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  describe.each`
    decoratorsCount
    ${2}
    ${3}
    ${4}
    ${5}
  `('should report DuplicateDecoratorError, decoratorsCount: $decoratorsCount', ({ decoratorsCount }) => {
    it.each`
        decoratorName      | expectedStart
        ${'Bean'}          | ${102}
        ${'PreDestroy'}    | ${114}
        ${'Embedded'}      | ${110}
        ${'Lazy'}          | ${102}
        ${'PostConstruct'} | ${120}
        ${'Scope'}         | ${104}
        ${'Primary'}       | ${108}
        ${'Qualifier'}     | ${112}
    `('decoratorName: $decoratorName, expectedStart: $expectedStart', ({ decoratorName, expectedStart }) => {
      //Given
      const fileContent = getFile(__dirname, 'index.ts', {
        decoratorName,
        decoratorExpression: Array(decoratorsCount).fill(`@${decoratorName}`).join(' '),
      });
      compiler.loadFile('/index.ts', fileContent);

      //When
      const diagnostics = compiler.compile();

      //Then
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0].messageText).toEqual(`Decorator must not be used more than once on the same declaration. @${decoratorName} was used ${decoratorsCount} times, but expected 1.`);
      expect(diagnostics[0].start).toEqual(expectedStart);
      expect(diagnostics[0].file?.fileName).toEqual('/index.ts');
      expect(diagnostics[0].source).toEqual('CT2');
    });
  });
});
