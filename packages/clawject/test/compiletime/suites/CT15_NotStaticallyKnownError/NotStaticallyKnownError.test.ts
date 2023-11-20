import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('NotStaticallyKnownError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report NotStaticallyKnownError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: 'Element should be statically known. Bean element should have statically known name.',
        start: 191,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContextWithPropertyNames\' is declared here.',
            start: 135,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Element should be statically known. Bean element should have statically known name.',
        start: 232,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContextWithPropertyNames\' is declared here.',
            start: 135,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Element should be statically known. Bean element should have statically known name.',
        start: 258,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContextWithPropertyNames\' is declared here.',
            start: 135,
            file: {
              fileName: '/index.ts'
            }
          }
        ]
      },
      {
        messageText: 'Element should be statically known. Argument #0 should be statically known literal.',
        start: 350,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: []
      }
    ];

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT15');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
