import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('IncorrectTypeError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report IncorrectTypeError when bean types are wrong', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostic: DiagnosticsLight[] = [
      {
        messageText: 'Incorrect type. Type \'undefined\' not supported as a Bean type.',
        start: 109,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 59,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'void\' not supported as a Bean type.',
        start: 146,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 59,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'null\' not supported as a Bean type.',
        start: 178,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 59,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'never\' not supported as a Bean type.',
        start: 208,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 59,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'union\' not supported as a Bean type.',
        start: 259,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 59,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT8');

    expect(searchedDiagnostic).toHaveLength(5);

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostic);
  });
});
