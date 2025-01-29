import type ts from 'typescript';
import { Context } from '../../compilation-context/Context';
import { processClassDeclaration } from '../application-mode/processClassDeclaration';
import { cleanup } from '../cleaner/cleanup';
import type { TransformerExtras } from 'ts-patch';
import { DiagnosticsBuilder } from '../../ts-diagnostics/DiagnosticsBuilder';
import { compact } from 'lodash';

export class Compiler {
  private static oldProgramRef: WeakRef<ts.Program> | null = null;
  public static projectVersion = 0;
  private static oldFileNames = new Set<string>();

  static compile(transformationContext: ts.TransformationContext | undefined, transformerExtras: TransformerExtras | undefined): void {
    const versionUpdated = this.updateProjectVersion();

    if (!versionUpdated) {
      return;
    }

    this.oldFileNames.forEach(fileName => {
      cleanup(fileName);
    });
    Context.clearMessages();

    const filesToProcess = this.getFilesToProcess();
    this.processFiles(transformationContext, filesToProcess);
    this.reportErrors(transformerExtras);
  }

  private static updateProjectVersion(): boolean {
    const actualProgram = Context.program;
    const oldProgram = this.oldProgramRef?.deref();

    const versionUpdated = oldProgram !== actualProgram;

    if (versionUpdated) {
      this.projectVersion++;
      this.oldProgramRef = new WeakRef(actualProgram);
    }

    return versionUpdated;
  }

  private static getFilesToProcess(): ts.SourceFile[] {
    return Context.program.getSourceFiles().filter(sourceFile => {
      return !sourceFile.isDeclarationFile;
    });
  }

  private static processFiles(transformationContext: ts.TransformationContext | undefined, files: ts.SourceFile[]): void {
    files.forEach(file => this.processFile(transformationContext, file));
  }

  private static processFile(transformationContext: ts.TransformationContext | undefined, sourceFile: ts.SourceFile): void {
    const visitor = (node: ts.Node): ts.Node => {
      if (!Context.ts.isClassDeclaration(node)) {
        return Context.ts.visitEachChild(node, visitor, transformationContext);
      }


      // const decoratorVerificationErrors = getDecoratorVerificationErrors(node);

      //Skipping processing anything because of errors
      // if (decoratorVerificationErrors.length !== 0) {
      //   decoratorVerificationErrors.forEach(it => Context.report(it));
      //   return node;
      // }

      processClassDeclaration(node);

      return Context.ts.visitEachChild(node, visitor, transformationContext);
    };

    Context.ts.visitNode(sourceFile, visitor);
    this.oldFileNames.add(sourceFile.fileName);
  }

  private static reportErrors(transformerExtras?: TransformerExtras) {
    if (Context.areErrorsHandled) {
      return;
    }

    if (Context.languageServiceMode) {
      return;
    }

    const addDiagnostics = transformerExtras?.addDiagnostic;

    if (addDiagnostics) {
      const semanticDiagnostics = DiagnosticsBuilder.getDiagnostics();

      semanticDiagnostics.forEach(it => {
        transformerExtras?.addDiagnostic(it);
      });
    } else if (Context.errors.length > 0) {
      // Falling back to throwing error from the compiler,
      // if ts-patch is not used - in watch mode it will finish a process
      const errors = Context.errors;

      if (errors.length > 0) {
        const mapped = compact(errors.map(it => DiagnosticsBuilder.compilationMessageToDiagnostic(it)));
        const formatted = DiagnosticsBuilder.diagnosticsToString(mapped);

        console.log(formatted);
        process.exit(1);
      }
    }
  }
}
