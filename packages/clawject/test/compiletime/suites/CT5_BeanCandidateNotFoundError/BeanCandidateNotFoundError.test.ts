import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('BeanCandidateNotFoundError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report BeanCandidateNotFoundError when can not qualify injection candidate', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostic: DiagnosticsLight[] = [
      {
        messageText: 'Found 0 injection candidates.',
        start: 110,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'beanFunction\' is declared here.',
            start: 260,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 127,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 213,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 236,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'beanFunction\' is declared here.',
            start: 260,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 144,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'beanFunction\' is declared here.',
            start: 260,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },

      {
        messageText: 'Found 0 injection candidates.',
        start: 318,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 335,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 213,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 236,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 352,
        file: {
          fileName: '/index.ts'
        },
      },

      {
        messageText: 'Found 0 injection candidates.',
        start: 415,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 432,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 213,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 236,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 449,
        file: {
          fileName: '/index.ts'
        },
      },

      {
        messageText: 'Found 0 injection candidates.',
        start: 501,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 518,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 213,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 236,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 535,
        file: {
          fileName: '/index.ts'
        },
      },
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT5');

    matchDiagnostics(searchedDiagnostic, expectedDiagnostic);
  });
});
