import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import expectedDiagnostic from './expectedDiagnostic.json';

describe('IncorrectTypeError', () => {
  const compiler = new Compiler();

  it('should report IncorrectTypeError when bean types are wrong', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE8');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostic);
  });
});
