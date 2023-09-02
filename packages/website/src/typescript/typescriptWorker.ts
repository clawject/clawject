import * as ts from 'runtimeTS';
import { createSystem, createVirtualTypeScriptEnvironment } from '@typescript/vfs';

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  const compilerHost = ts.createCompilerHost(options, true);
  const program = ts.createProgram(fileNames, options, compilerHost);
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const {line, character} = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

compile(process.argv.slice(2), {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});

const fsMap = new Map<string, string>();
const system = createSystem(fsMap);

const compilerOpts = {};
const env = createVirtualTypeScriptEnvironment(system, ['index.ts'], ts, compilerOpts);

// You can then interact with the languageService to introspect the code
env.languageService.getDocumentHighlights('index.ts', 0, ['index.ts']);
