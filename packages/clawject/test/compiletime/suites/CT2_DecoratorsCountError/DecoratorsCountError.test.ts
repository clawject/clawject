import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';

describe('DecoratorsCountError', () => {
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
  `('should report DecoratorsCountError, decoratorsCount: $decoratorsCount', ({ decoratorsCount }) => {
    it.each`
        decoratorName      | expectedStart
        ${'Bean'}          | ${98}
        ${'PreDestroy'}    | ${110}
        ${'Embedded'}      | ${106}
        ${'Lazy'}          | ${98}
        ${'PostConstruct'} | ${116}
        ${'Scope'}         | ${100}
        ${'Primary'}       | ${104}
        ${'Qualifier'}     | ${108}
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
