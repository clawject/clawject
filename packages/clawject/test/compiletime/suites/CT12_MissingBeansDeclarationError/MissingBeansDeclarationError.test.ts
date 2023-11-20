import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('MissingBeansDeclarationError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report MissingBeansDeclarationError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: 'Missing Bean declaration. Following beans are required, but not found in context.',
        start: 176,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'b\' is declared here.',
            start: 106,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'c\' is declared here.',
            start: 114,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'d\' is declared here.',
            start: 127,
            file: {
              fileName: '/index.ts'
            }
          },
        ]
      }
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT12');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
