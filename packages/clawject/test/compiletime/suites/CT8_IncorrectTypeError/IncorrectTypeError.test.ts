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
        start: 128,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'void\' not supported as a Bean type.',
        start: 180,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'null\' not supported as a Bean type.',
        start: 227,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'never\' not supported as a Bean type.',
        start: 270,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'union\' not supported as a Bean type.',
        start: 328,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },

      {
        messageText: 'Incorrect type. Type \'undefined\' not supported as a Bean type.',
        start: 391,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'void\' not supported as a Bean type.',
        start: 452,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'null\' not supported as a Bean type.',
        start: 508,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'never\' not supported as a Bean type.',
        start: 560,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'union\' not supported as a Bean type.',
        start: 626,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },

      {
        messageText: 'Incorrect type. Type \'undefined\' not supported as a Bean type.',
        start: 708,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'void\' not supported as a Bean type.',
        start: 783,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'null\' not supported as a Bean type.',
        start: 853,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'never\' not supported as a Bean type.',
        start: 919,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Incorrect type. Type \'union\' not supported as a Bean type.',
        start: 999,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 63,
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

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostic);
  });
});
