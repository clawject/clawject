import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import expectedDiagnostic from './expectedDiagnostic.json';

describe('BeanCandidateNotFoundError', () => {
  const compiler = new Compiler();

  it('should report BeanCandidateNotFoundError when can not qualify injection candidate', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE5');

    matchDiagnostics(searchedDiagnostic, expectedDiagnostic);
  });
});
