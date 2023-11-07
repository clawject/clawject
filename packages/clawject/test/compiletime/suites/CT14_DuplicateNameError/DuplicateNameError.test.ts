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
        start: 102,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'a\' is declared here.',
            start: 134,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Duplicate name.',
        start: 134,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'a\' is declared here.',
            start: 102,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Duplicate name.',
        start: 151,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'c\' is declared here.',
            start: 167,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Duplicate name.',
        start: 167,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'c\' is declared here.',
            start: 151,
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
