import { Compiler } from '../../helpers/Compiler';
import expectedDiagnostics from './expectedDiagnostics.json';
import { getFile } from '../../helpers/utils';

describe('DevMode', () => {
  process.env['NODE_ENV'] = 'development';

  const compiler = new Compiler();

  it('should report when file contents updated with nesting', () => {
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
    const emptyDiagnosticsA = compiler.getDiagnostics('/A.ts');
    const emptyDiagnosticsB = compiler.getDiagnostics('/B.ts');
    const emptyDiagnosticsC = compiler.getDiagnostics('/C.ts');

    //Then
    expect(emptyDiagnosticsA).toHaveLength(0);
    expect(emptyDiagnosticsB).toHaveLength(0);
    expect(emptyDiagnosticsC).toHaveLength(0);

    //When
    const contentCUpdated = `
import { Bean, Configuration, PostConstruct } from '@clawject/di';

@Configuration
export class C {
  @Bean c = 'c' as const;

  @PostConstruct
  postConstruct(d: 'd'): void {
    console.log(d);
  }
}
`.trim();

    compiler.loadFile('/C.ts', contentCUpdated);

    const diagnosticsC = compiler.getDiagnostics('/C.ts');

    //Then
    expect(diagnosticsC).toMatchObject(expectedDiagnostics);
  });

  it('should emit additional metadata for configurations', () => {
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
    expect(getFile(__dirname, 'dev/emittedA', {})).toEqual(emitA.outputFiles[0].text);
    expect(getFile(__dirname, 'dev/emittedB', {})).toEqual(emitB.outputFiles[0].text);
    expect(getFile(__dirname, 'dev/emittedC1', {})).toEqual(emitC.outputFiles[0].text);

    //When
    const contentCUpdated = `
import { Bean, Configuration } from '@clawject/di';

@Configuration
export class C {
  @Bean c = 'c' as const;
  @Bean abc(a: 'a', b: 'b', c: 'c'): 'abc' {
    return (a + b + c) as 'abc';
  }
}
`.trim();

    compiler.loadFile('/C.ts', contentCUpdated);

    const emitCUpdated = compiler.compile('/C.ts');

    //Then
    expect(getFile(__dirname, 'dev/emittedC2', {})).toEqual(emitCUpdated.outputFiles[0].text);
  });
});
