import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import expectedDiagnostics from './expectedDiagnostics.json';

describe('DuplicateNameError', () => {
  const compiler = new Compiler();

  it('should report DuplicateNameError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE14');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
