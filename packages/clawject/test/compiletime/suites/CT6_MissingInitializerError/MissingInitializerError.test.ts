import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('MissingInitializerError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report MissingInitializerError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostic: DiagnosticsLight[] = [
      //TODO Refactor to avoid duplication of diagnostics
      {
        messageText: 'Missing initializer.',
        start: 123,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Missing initializer.',
        start: 123,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Missing initializer.',
        start: 123,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Missing initializer.',
        start: 123,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Missing initializer. Lifecycle method should have a body.',
        start: 159,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Missing initializer. Lifecycle method should have a body.',
        start: 196,
        file: {
          fileName: '/index.ts'
        },
      },
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT6');

    expect(searchedDiagnostic).toHaveLength(6);

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostic);
  });
});
