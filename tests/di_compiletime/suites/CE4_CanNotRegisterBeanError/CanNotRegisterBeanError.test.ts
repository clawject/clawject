import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('CanNotRegisterBeanError', () => {
  const compiler = new Compiler();

  it('should report CanNotRegisterBeanError when can not resolve dependency for Beans declared via function', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: 'Can not register Bean.',
        start: 347,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: 'Cannot find a Bean candidate for \'num\'.',
            start: 113,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: 'Cannot find a Bean candidate for \'sym\'.',
            start: 130,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'Application\' is declared here.',
            start: 284,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Can not register Bean.',
        start: 412,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: 'Cannot find a Bean candidate for \'str\'.',
            start: 235,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'Application\' is declared here.',
            start: 284,
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
      .filter((diagnostic) => diagnostic.source === 'CE4');

    matchDiagnostics(searchedDiagnostic, expectedDiagnostics);
  });
});
