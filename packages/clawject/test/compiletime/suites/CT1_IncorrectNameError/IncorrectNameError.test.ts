import { getFile } from '../../helpers/utils';
import { Compiler } from '../../helpers/Compiler';

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

    //When
    const diagnostics = compiler.compile();

    //Then
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].messageText).toEqual(`Incorrect name. '${classMemberName}' name is reserved for the di-container.`);
    expect(diagnostics[0].start).toEqual(86);
    expect(diagnostics[0].file?.fileName).toEqual('/index.ts');
    expect(diagnostics[0].source).toEqual('CT1');
  });
});
