import fs from 'fs';

const max = 500;

for (let i = 0; i < max; i++) {
  const imports = [];
  const constructorDependencies = [];

  for (let j = 0; j < i; j++) {
    imports.push(`import { IClass${j} } from './Class${j}';`);
    constructorDependencies.push(`private class${j}: IClass${j}`);
  }

  if (!fs.existsSync('src/benchmark')) {
    fs.mkdirSync('src/benchmark');
  }

  fs.writeFileSync(
    `src/benchmark/Class${i}.ts`,
    `
    ${imports.join('\n')}

    export interface IClass${i} {}
    export class Class${i} implements IClass${i} {
      constructor(
        ${constructorDependencies.join(',\n')}
      ) {}
    }`);
}

const imports = [];
const beans = [];

for (let i = 0; i < max; i++) {
  imports.push(`import { Class${i} } from './Class${i}';`);
  beans.push(`class${i} = Bean(Class${i});`);
}

fs.writeFileSync(
  'src/benchmark/clawject.ts',
  `
  import {Bean, ClawjectApplication} from '@clawject/di';
  ${imports.join('\n')}

  @ClawjectApplication
  export class MainApplication {

  ${beans.join('\n')}
  }
  `,
);
