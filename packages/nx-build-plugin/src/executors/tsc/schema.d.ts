export interface TscExecutorSchema {
  sourceRoot: string;
  packageDir: string;
  tsconfig: string;
  additionalEntryPoints: {route: string, filePath: string}[];
  extractApi: boolean;
  generateExportsFields: boolean;
  copyFiles: {from: string, to: string, glob: boolean}[];
}
