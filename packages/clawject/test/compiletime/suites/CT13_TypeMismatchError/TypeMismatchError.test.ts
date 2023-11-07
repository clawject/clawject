import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('TypeMismatchError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report TypeMismatchError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: 'Type mismatch. Following Beans are not compatible with type declared in base Context type.',
        start: 120,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'a\' is declared here.',
            start: 136,
            file: {
              fileName: '/index.ts'
            }
          },
          {
            messageText: '\'MyContext\' is declared here.',
            start: 91,
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
      .filter((diagnostic) => diagnostic.source === 'CT13');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
