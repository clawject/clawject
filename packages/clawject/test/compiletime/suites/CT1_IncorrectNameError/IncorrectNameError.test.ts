import { getFile, matchDiagnostics } from '../../helpers/utils';
import { Compiler } from '../../helpers/Compiler';
import { DiagnosticsLight } from '../../helpers/DiagnosticsLight';

describe('IncorrectNameError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it.each`
    classMemberName
    ${'clawject_context_metadata'}
    ${'clawject_component_metadata'}
    ${'clawject_context_type'}
    ${'clawject_configuration_init'}
    ${'clawject_compile_time_metadata'}
  `('should report IncorrectNameError for class member with name $classMemberName', ({ classMemberName }) => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', { classMemberName });
    compiler.loadFile('/index.ts', fileContent);

    const expectedDiagnostics: DiagnosticsLight[] = [
      {
        messageText: `Incorrect name. '${classMemberName}' name is reserved for the di-container.`,
        start: 86,
        file: {
          fileName: '/index.ts'
        },
        relatedInformation: [
          {
            messageText: '\'MyContext\' is declared here.',
            start: 53,
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
      .filter((diagnostic) => diagnostic.source === 'CT1');

    matchDiagnostics(searchedDiagnostic, expectedDiagnostics);
  });
});
