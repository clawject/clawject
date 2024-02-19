import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import expectedDiagnostics from './expectedDiagnostics.json';

describe('IncorrectArgumentsLengthError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report IncorrectArgumentsLengthError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE9');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
