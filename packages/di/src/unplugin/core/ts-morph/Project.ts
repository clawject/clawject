/**
 * Code of this file is based on ts-morph/common and ts-morph/bootstrap packages from this repository https://github.com/dsherret/ts-morph
 *
 * Unfortunately, typescript package is bundled together with ts-morph, but we want it to be a peer dependency, so we can't use it directly.
 * */

import type * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

export interface ProjectOptions {
  ts: typeof ts;
  compilerOptions?: ts.CompilerOptions;
  tsConfigFilePath?: string;
  skipAddingFilesFromTsConfig?: boolean;
}

export function createProject(ts: typeof import('typescript'), options: Omit<ProjectOptions, 'ts'> = {}): Project {
  const project = new Project({ ...options, ts });

  // Load files from tsconfig if provided
  if (options.tsConfigFilePath && !options.skipAddingFilesFromTsConfig) {
    project.addSourceFilesFromTsConfig(options.tsConfigFilePath);
  }

  return project;
}

export class Project {
  #ts: typeof ts;
  #sourceFiles = new Map<string, ts.SourceFile>();
  #compilerOptions: ts.CompilerOptions;

  constructor(options: ProjectOptions) {
    this.#ts = options.ts;

    // Load compiler options from tsconfig if provided
    if (options.tsConfigFilePath) {
      const configPath = path.resolve(options.tsConfigFilePath);
      const configFile = this.#ts.readConfigFile(configPath, this.#ts.sys.readFile);

      if (configFile.error) {
        throw new Error(`Error reading tsconfig: ${configFile.error.messageText}`);
      }

      const parsedConfig = this.#ts.parseJsonConfigFileContent(
        configFile.config,
        this.#ts.sys,
        path.dirname(configPath)
      );

      this.#compilerOptions = {
        ...parsedConfig.options,
        ...(options.compilerOptions || {})
      };
    } else {
      this.#compilerOptions = options.compilerOptions || {};
    }
  }

  addSourceFilesFromTsConfig(tsConfigFilePath: string): void {
    const configPath = path.resolve(tsConfigFilePath);
    const configFile = this.#ts.readConfigFile(configPath, this.#ts.sys.readFile);

    if (configFile.error) {
      throw new Error(`Error reading tsconfig: ${configFile.error.messageText}`);
    }

    const parsedConfig = this.#ts.parseJsonConfigFileContent(
      configFile.config,
      this.#ts.sys,
      path.dirname(configPath)
    );

    // Add all files from tsconfig
    for (const fileName of parsedConfig.fileNames) {
      if (fs.existsSync(fileName)) {
        const sourceText = fs.readFileSync(fileName, 'utf-8');
        this.updateSourceFile(fileName, sourceText);
      }
    }
  }

  getSourceFile(fileName: string): ts.SourceFile | undefined {
    return this.#sourceFiles.get(this.#normalizeFileName(fileName));
  }

  updateSourceFile(fileName: string, sourceText: string): ts.SourceFile;
  updateSourceFile(sourceFile: ts.SourceFile): ts.SourceFile;
  updateSourceFile(fileNameOrSourceFile: string | ts.SourceFile, sourceText?: string): ts.SourceFile {
    let sourceFile: ts.SourceFile;

    if (typeof fileNameOrSourceFile === 'string') {
      const normalizedFileName = this.#normalizeFileName(fileNameOrSourceFile);
      sourceFile = this.#ts.createSourceFile(
        normalizedFileName,
        sourceText!,
        this.#compilerOptions.target || this.#ts.ScriptTarget.Latest,
        true
      );
    } else {
      sourceFile = fileNameOrSourceFile;
    }

    const normalizedFileName = this.#normalizeFileName(sourceFile.fileName);
    this.#sourceFiles.set(normalizedFileName, sourceFile);
    return sourceFile;
  }

  createSourceFile(fileName: string, sourceText: string = ''): ts.SourceFile {
    const normalizedFileName = this.#normalizeFileName(fileName);

    if (this.#sourceFiles.has(normalizedFileName)) {
      throw new Error(`Source file already exists: ${fileName}`);
    }

    const sourceFile = this.#ts.createSourceFile(
      normalizedFileName,
      sourceText,
      this.#compilerOptions.target || this.#ts.ScriptTarget.Latest,
      true
    );

    this.#sourceFiles.set(normalizedFileName, sourceFile);
    return sourceFile;
  }

  removeSourceFile(fileName: string): void;
  removeSourceFile(sourceFile: ts.SourceFile): void;
  removeSourceFile(fileNameOrSourceFile: string | ts.SourceFile): void {
    const fileName = typeof fileNameOrSourceFile === 'string'
      ? fileNameOrSourceFile
      : fileNameOrSourceFile.fileName;

    this.#sourceFiles.delete(this.#normalizeFileName(fileName));
  }

  resolveSourceFileDependencies(): void {
    // Creating a program will resolve dependencies
    this.createProgram();
  }

  createProgram(options?: ts.CreateProgramOptions): ts.Program {
    const rootNames = Array.from(this.#sourceFiles.keys());

    const compilerHost = this.#ts.createCompilerHost(this.#compilerOptions);

    // Override getSourceFile to use our cached source files
    const originalGetSourceFile = compilerHost.getSourceFile;
    compilerHost.getSourceFile = (fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile) => {
      const normalizedFileName = this.#normalizeFileName(fileName);
      const cachedFile = this.#sourceFiles.get(normalizedFileName);
      if (cachedFile) {
        return cachedFile;
      }
      return originalGetSourceFile.call(
        compilerHost,
        fileName,
        languageVersionOrOptions,
        onError,
        shouldCreateNewSourceFile
      );
    };

    const program = this.#ts.createProgram({
      rootNames,
      options: this.#compilerOptions,
      host: compilerHost,
      ...options,
    });

    //Necessary to set parent nodes
    program.getTypeChecker();

    return program;
  }

  #normalizeFileName(fileName: string): string {
    // Normalize path separators and resolve to absolute path
    return path.resolve(fileName).replace(/\\/g, '/');
  }
}
