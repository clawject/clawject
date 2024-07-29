import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';
import expectedDiagnostics from './expectedDiagnostics.json';

describe('BeanExposingError', () => {
  const compiler = new Compiler();

  it('should report BeanExposingError', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE12');

    expect(searchedDiagnostic).toMatchObject(expectedDiagnostics);
  });
});
