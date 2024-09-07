import { Compiler } from '../../helpers/Compiler';
import expectedDiagnostics from './expectedDiagnostics.json';
import { getFile } from '../../helpers/utils';

describe('DevMode', () => {
  process.env['NODE_ENV'] = 'development';

  let compiler: Compiler;

  beforeEach(() => {
    compiler = new Compiler();
  });

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
    expect(getFile(__dirname, 'dev0/emittedA', {})).toEqual(emitA.outputFiles[0].text);
    expect(getFile(__dirname, 'dev0/emittedB', {})).toEqual(emitB.outputFiles[0].text);
    expect(getFile(__dirname, 'dev0/emittedC1', {})).toEqual(emitC.outputFiles[0].text);


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
    expect(getFile(__dirname, 'dev0/emittedC2', {})).toEqual(emitCUpdated.outputFiles[0].text);
  });

  it('should emit additional metadata for configurations and application when changing nested configuration and then application', () => {
    //Given
    const contentA = `
import { Bean, ClawjectApplication, Import, PostConstruct } from '@clawject/di';
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
    expect(getFile(__dirname, 'dev1/emittedA1', {})).toEqual(emitA.outputFiles[0].text);
    expect(getFile(__dirname, 'dev1/emittedB', {})).toEqual(emitB.outputFiles[0].text);
    expect(getFile(__dirname, 'dev1/emittedC1', {})).toEqual(emitC.outputFiles[0].text);

    //When
    const contentCUpdated = `
import { Bean, Configuration } from '@clawject/di';

@Configuration
export class C {
  @Bean c = 'c' as const;
}
`.trim();

    const contentAUpdated = `
import { Bean, ClawjectApplication, Import, PostConstruct } from '@clawject/di';
import { B } from './B';

@ClawjectApplication
class A {
  b = Import(B);

  @Bean a = 'a' as const;

  @PostConstruct
  allBeans(all: Map<string, any>): void {
    console.log(all);
  }
}
    `.trim();

    compiler.loadFile('/C.ts', contentCUpdated);

    const emitCUpdated = compiler.compile('/C.ts');

    compiler.loadFile('/A.ts', contentAUpdated);

    const emitAUpdated = compiler.compile('/A.ts');

    //Then
    expect(getFile(__dirname, 'dev1/emittedC2', {})).toEqual(emitCUpdated.outputFiles[0].text);
    expect(getFile(__dirname, 'dev1/emittedA2', {})).toEqual(emitAUpdated.outputFiles[0].text);
  });

  it('should emit additional metadata for file in which class is located when class is registered as a bean', () => {
    //Given
    const contentA = `
import { Bean, ClawjectApplication, Import, PostConstruct } from '@clawject/di';
import { B } from './B';

@ClawjectApplication
class A {
  @Bean dep = 'dep';
  b = Bean(B);
}
    `.trim();
    const contentB = `
export class B {}
`.trim();

    compiler.loadFile('/B.ts', contentB);
    compiler.loadFile('/A.ts', contentA);

    //When
    const emitA = compiler.compile('/A.ts');
    const emitB = compiler.compile('/B.ts');

    //Then
    expect(getFile(__dirname, 'dev2/emittedA', {})).toEqual(emitA.outputFiles[0].text);
    expect(getFile(__dirname, 'dev2/emittedB1', {})).toEqual(emitB.outputFiles[0].text);

    //When
    const contentBUpdated = `
export class B {
  constructor(dep: string) {}
}
`.trim();

    compiler.loadFile('/B.ts', contentBUpdated);

    const emitBUpdated = compiler.compile('/B.ts');

    //Then
    expect(getFile(__dirname, 'dev2/emittedB2', {})).toEqual(emitBUpdated.outputFiles[0].text);
  });
});
