import * as ts from 'typescript';
import * as tsvfs from '@typescript/vfs';
import { createDefaultMapFromNodeModules } from '@typescript/vfs';
import * as path from 'path';

const compilerOptions: ts.CompilerOptions = {
  experimentalDecorators: ts.versionMajorMinor.startsWith('4'),
  target: ts.ScriptTarget.Latest,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  plugins: [
    {
      transform: '@clawject/di/transformer'
    }
  ] as any[]
};

export class Compiler {
  private virtualFSMap = createDefaultMapFromNodeModules({target: compilerOptions.target});
  private system = tsvfs.createFSBackedSystem(
    this.virtualFSMap,
    path.join(__dirname, '../'),
    ts,
  );
  private host = tsvfs.createVirtualCompilerHost(this.system, compilerOptions, ts);

  constructor() {
    const clawjectBasePath = path.join(require.resolve('@clawject/di'), '../../..');
    const clawjectDeclarationFilePath = path.join(clawjectBasePath, 'dist/types', 'index.d.ts');
    const clawjectPackageJsonFilePath = path.join(clawjectBasePath, 'package.json');
    const contentDeclaration = this.host.compilerHost.readFile(clawjectDeclarationFilePath)!;
    const contentJson = this.host.compilerHost.readFile(clawjectPackageJsonFilePath)!;

    this.loadFile('/node_modules/@clawject/di/dist/types/index.d.ts', contentDeclaration);
    this.loadFile('/node_modules/@clawject/di/package.json', contentJson);
    this.loadFile('/package.json', JSON.stringify({
      name: 'test',
      dependencies: {
        '@clawject/di': '0.0.0',
      },
    }));
  }

  loadFile(fileName: string, content: string): void {
    this.virtualFSMap.set(fileName, content);
  }

  compile(): ts.Diagnostic[] {
    const program = ts.createProgram({
      rootNames: [
        ...this.virtualFSMap.keys(),
      ],
      options: compilerOptions,
      host: this.host.compilerHost,
    });
    const emitResult = program.emit();

    return Array.from(emitResult.diagnostics);
  }
}

