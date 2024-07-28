import { Compiler } from '../../helpers/Compiler';
import { getFile } from '../../helpers/utils';

describe('NotDevMode', () => {
  process.env['NODE_ENV'] = 'production';

  const compiler = new Compiler();

  it('should not emit additional metadata for configurations', () => {
    //Given
    const contentA = `
import { Bean, ClawjectApplication, Import } from '@clawject/di';
import { B } from './B';

@ClawjectApplication
class A {
  b = Import(B);

  @Bean a = 'a' as const;
}
    `.trim();
    const contentB = `
import { Bean, Configuration, Import } from '@clawject/di';
import { C } from './C';

@Configuration
export class B {
  C = Import(C);

  @Bean b = 'b' as const;
}
`.trim();
    const contentC = `
import { Bean, Configuration } from '@clawject/di';

@Configuration
export class C {
  @Bean c = 'c' as const;
}
`.trim();

    compiler.loadFile('/C.ts', contentC);
    compiler.loadFile('/B.ts', contentB);
    compiler.loadFile('/A.ts', contentA);

    //When
    const emitA = compiler.compile('/A.ts');
    const emitB = compiler.compile('/B.ts');
    const emitC = compiler.compile('/C.ts');

    //Then
    expect(getFile(__dirname, 'not-dev/emittedA', {})).toEqual(emitA.outputFiles[0].text);
    expect(getFile(__dirname, 'not-dev/emittedB', {})).toEqual(emitB.outputFiles[0].text);
    expect(getFile(__dirname, 'not-dev/emittedC', {})).toEqual(emitC.outputFiles[0].text);
  });
});
