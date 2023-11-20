import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('DuplicateNameError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report DuplicateNameError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: 'Duplicate name.',
        start: 106,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'a\' is declared here.',
            start: 138,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Duplicate name.',
        start: 138,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'a\' is declared here.',
            start: 106,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Duplicate name.',
        start: 155,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'c\' is declared here.',
            start: 171,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Duplicate name.',
        start: 171,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'c\' is declared here.',
            start: 155,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      }
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT14');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
