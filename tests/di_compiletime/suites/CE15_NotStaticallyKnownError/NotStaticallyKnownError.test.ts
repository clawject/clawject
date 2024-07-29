import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import expectedDiagnostics from './expectedDiagnostics.json';

describe('NotStaticallyKnownError', () => {
  const compiler = new Compiler();

  it('should report NotStaticallyKnownError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE15');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
