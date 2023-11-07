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
        start: 106,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'beanFunction\' is declared here.',
            start: 256,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 123,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 209,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 232,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'beanFunction\' is declared here.',
            start: 256,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 140,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'beanFunction\' is declared here.',
            start: 256,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },

      {
        messageText: 'Found 0 injection candidates.',
        start: 314,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 331,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 209,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 232,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 348,
        file: {
          fileName: '/index.ts'
        },
      },

      {
        messageText: 'Found 0 injection candidates.',
        start: 411,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 428,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 209,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 232,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 445,
        file: {
          fileName: '/index.ts'
        },
      },

      {
        messageText: 'Found 0 injection candidates.',
        start: 497,
        file: {
          fileName: '/index.ts'
        },
      },
      {
        messageText: 'Found 2 injection candidates.',
        start: 514,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'str0\' matched by type.',
            start: 209,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'str1\' matched by type.',
            start: 232,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Found 0 injection candidates.',
        start: 531,
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
