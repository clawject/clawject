import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import expectedDiagnostic from './expectedDiagnostic.json';

describe('MissingInitializerError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report MissingInitializerError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE6');

    expect(searchedDiagnostic).toHaveLength(6);

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostic);
  });
});
