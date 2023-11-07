import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('CanNotRegisterBeanError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report CanNotRegisterBeanError when can not resolve dependency for Beans declared via function', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: 'Can not register Bean.',
        start: 337,
        file: {
          fileName: '/index.ts',
        },
        relatedInformation: [
          {
            messageText: 'Can not find Bean candidate for \'num\'.',
            start: 100,
            file: {
              fileName: '/index.ts',
            },
          },
          {
            messageText: 'Can not find Bean candidate for \'sym\'.',
            start: 117,
            file: {
              fileName: '/index.ts',
            },
          }
        ]
      },
      {
        messageText: 'Can not register Bean.',
        start: 402,
        file: {
          fileName: '/index.ts',
        },
        relatedInformation: [
          {
            messageText: 'Can not find Bean candidate for \'str\'.',
            start: 222,
            file: {
              fileName: '/index.ts',
            },
          },
        ]
      },
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT4');

    matchDiagnostics(searchedDiagnostic, expectedDiagnostics);
  });
});
