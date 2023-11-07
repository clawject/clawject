import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import expectedDiagnosticsBeanFunction from './expectedDiagnosticsBeanFunction.json';
import expectedDiagnosticsBeanFactoryMethod from './expectedDiagnosticsBeanFactoryMethod.json';
import expectedDiagnosticsBeanFactoryArrowFunction from './expectedDiagnosticsBeanFactoryArrowFunction.json';

describe('CircularDependenciesError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report CircularDependenciesError for beanFunctions', () => {
    //Given
    const fileContent = getFile(__dirname, 'beanFunction.ts', {});
    compiler.loadFile('/beanFunction.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT7');

    matchDiagnostics(searchedDiagnostic, expectedDiagnosticsBeanFunction);
  });

  it('should report CircularDependenciesError for beanFactoryMethod', () => {
    //Given
    const fileContent = getFile(__dirname, 'beanFactoryMethod.ts', {});
    compiler.loadFile('/beanFactoryMethod.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT7');

    matchDiagnostics(searchedDiagnostic, expectedDiagnosticsBeanFactoryMethod);
  });

  it('should report CircularDependenciesError for beanFactoryArrowFunction', () => {
    //Given
    const fileContent = getFile(__dirname, 'beanFactoryArrowFunction.ts', {});
    compiler.loadFile('/beanFactoryArrowFunction.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT7');

    matchDiagnostics(searchedDiagnostic, expectedDiagnosticsBeanFactoryArrowFunction);
  });
});
