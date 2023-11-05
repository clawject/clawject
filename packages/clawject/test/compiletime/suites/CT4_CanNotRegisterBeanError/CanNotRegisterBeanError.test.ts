import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';

describe('CanNotRegisterBeanError', () => {
  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

  it('should report CanNotRegisterBeanError when can not resolve dependency for Beans declared via function', () => {
    //Given
    const fileContent = getFile(__dirname, 'index.ts', {});
    compiler.loadFile('/index.ts', fileContent);

    //When
    const diagnostics = compiler.compile();

    //Then
    const searchedDiagnostic = diagnostics
      .filter((diagnostic) => diagnostic.source === 'CT4');

    expect(searchedDiagnostic).toHaveLength(2);

    expect(searchedDiagnostic[0].messageText).toEqual('Can not register Bean.');
    expect(searchedDiagnostic[0].start).toEqual(337);
    expect(searchedDiagnostic[0].file?.fileName).toEqual('/index.ts');

    expect(searchedDiagnostic[0].relatedInformation).toHaveLength(2);
    expect(searchedDiagnostic[0].relatedInformation![0].messageText).toEqual('Can not find Bean candidate for \'num\'.');
    expect(searchedDiagnostic[0].relatedInformation![0].start).toEqual(100);
    expect(searchedDiagnostic[0].relatedInformation![0].file?.fileName).toEqual('/index.ts');
    expect(searchedDiagnostic[0].relatedInformation![1].messageText).toEqual('Can not find Bean candidate for \'sym\'.');
    expect(searchedDiagnostic[0].relatedInformation![1].start).toEqual(117);
    expect(searchedDiagnostic[0].relatedInformation![1].file?.fileName).toEqual('/index.ts');

    expect(searchedDiagnostic[1].messageText).toEqual('Can not register Bean.');
    expect(searchedDiagnostic[1].start).toEqual(402);
    expect(searchedDiagnostic[1].file?.fileName).toEqual('/index.ts');

    expect(searchedDiagnostic[1].relatedInformation).toHaveLength(1);
    expect(searchedDiagnostic[1].relatedInformation![0].messageText).toEqual('Can not find Bean candidate for \'str\'.');
    expect(searchedDiagnostic[1].relatedInformation![0].start).toEqual(222);
    expect(searchedDiagnostic[1].relatedInformation![0].file?.fileName).toEqual('/index.ts');
  });
});
