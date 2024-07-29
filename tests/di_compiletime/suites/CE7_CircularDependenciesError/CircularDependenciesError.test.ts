import { Compiler } from '../../helpers/Compiler';
import { getFile, matchDiagnostics } from '../../helpers/utils';
import expectedDiagnosticsBeanFunction from './expectedDiagnosticsBeanFunction.json';
import expectedDiagnosticsBeanFactoryMethod from './expectedDiagnosticsBeanFactoryMethod.json';
import expectedDiagnosticsBeanFactoryArrowFunction from './expectedDiagnosticsBeanFactoryArrowFunction.json';

describe('CircularDependenciesError', () => {
  const compiler = new Compiler();

  afterEach(() => {
    compiler.loadFile('/beanFunction.ts', '');
    compiler.loadFile('/beanFactoryMethod.ts', '');
    compiler.loadFile('/beanFactoryArrowFunction.ts', '');
  });

  it('should report CircularDependenciesError for beanFunctions', () => {
    //Given
    const fileContent = getFile(__dirname, 'beanFunction.ts', {});
    compiler.loadFile('/beanFunction.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics('/beanFunction.ts');

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE7');

    matchDiagnostics(searchedDiagnostic, expectedDiagnosticsBeanFunction);
  });

  it('should report CircularDependenciesError for beanFactoryMethod', () => {
    //Given
    const fileContent = getFile(__dirname, 'beanFactoryMethod.ts', {});
    compiler.loadFile('/beanFactoryMethod.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics('/beanFactoryMethod.ts');

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE7');

    matchDiagnostics(searchedDiagnostic, expectedDiagnosticsBeanFactoryMethod);
  });

  it('should report CircularDependenciesError for beanFactoryArrowFunction', () => {
    //Given
    const fileContent = getFile(__dirname, 'beanFactoryArrowFunction.ts', {});
    compiler.loadFile('/beanFactoryArrowFunction.ts', fileContent);

    //When
    const diagnostics = compiler.getDiagnostics('/beanFactoryArrowFunction.ts');

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CE7');

    matchDiagnostics(searchedDiagnostic, expectedDiagnosticsBeanFactoryArrowFunction);
  });
});
