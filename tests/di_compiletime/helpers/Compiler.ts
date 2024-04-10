import * as ts from 'typescript';
import * as tsvfs from '@typescript/vfs';
import { createDefaultMapFromNodeModules, createVirtualTypeScriptEnvironment } from '@typescript/vfs';
import * as path from 'path';
import * as fs from 'node:fs';

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
  private system = tsvfs.createSystem(
    this.virtualFSMap,
  );
  private environment = createVirtualTypeScriptEnvironment(
    this.system,
    Array.from(this.virtualFSMap.keys()),
    ts,
    compilerOptions,
  );

  constructor() {
    const clawjectBasePath = path.dirname(require.resolve('@clawject/di'));
    const clawjectDeclarationFilePath = path.join(clawjectBasePath, 'index.d.ts');
    const clawjectPackageJsonFilePath = path.join(clawjectBasePath, 'package.json');
    const contentDeclaration = fs.readFileSync(clawjectDeclarationFilePath, 'utf-8');
    const contentJson = fs.readFileSync(clawjectPackageJsonFilePath, 'utf-8')!;

    this.loadFile('/node_modules/@clawject/di/index.d.ts', contentDeclaration);
    this.loadFile('/node_modules/@clawject/di/package.json', contentJson);
    this.loadFile('/package.json', JSON.stringify({
      name: 'test',
      dependencies: {
        '@clawject/di': '0.0.0',
      },
    }));
  }

  loadFile(fileName: string, content: string): void {
    const sourceFile = this.environment.getSourceFile(fileName);

    if (sourceFile) {
      this.environment.updateFile(fileName, content);
    } else {
      this.environment.createFile(fileName, content);
    }
  }

  compile(fileName?: string): ts.Diagnostic[] {
    // Any is for CI, because for some reason it's not working with the correct type on CI
    const emitResult: any = this.environment.languageService.getEmitOutput(fileName ?? '/index.ts');

    return Array.from(emitResult.diagnostics);
  }
}

