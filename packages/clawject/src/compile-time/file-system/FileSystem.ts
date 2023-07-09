import fs from 'fs';
import upath from 'upath';
import minimatch from 'minimatch';
import glob, { IOptions } from 'glob';
import { ProgramOptionsProvider } from '../program-options/ProgramOptionsProvider';

type FSMode = 'node_fs' | 'virtual_fs'

export class FileSystem {
  private static mode: FSMode = 'node_fs';
  private static data = new Map<string, string | undefined>();

  static async initVirtualFS(): Promise<void> {
    this.setMode('virtual_fs');

    const projectFiles = await this.globAsync('**/*', {
      ignore: [
        '**/node_modules/**',
      ],
      absolute: true,
      cwd: ProgramOptionsProvider.options.cwd
    });

    this.data.clear();

    projectFiles.forEach(filePath => {
      this.data.set(filePath, undefined);
    });
  }

  static setMode(mode: FSMode): void {
    this.mode = mode;
  }

  static clearVirtualFS(): void {
    this.data.clear();
  }

  static deleteFile(path: string): void {
    const normalizedPath = this.toUPath(path);

    if (this.mode === 'virtual_fs') {
      this.data.delete(normalizedPath);
    }
  }

  static writeVirtualFile(path: string, content: string): void {
    const normalizedPath = this.toUPath(path);

    if (this.mode === 'node_fs') {
      throw Error('Trying to write virtual file in node_fs mode');
    } else {
      this.data.set(normalizedPath, content);
    }
  }

  static exists(path: string): boolean {
    const normalizedPath = this.toUPath(path);

    if (this.mode === 'node_fs' || this.isFromNodeModules(normalizedPath)) {
      return fs.existsSync(normalizedPath);
    } else {
      return this.data.has(normalizedPath) || fs.existsSync(normalizedPath);
    }
  }

  static readFile(path: string): string {
    const normalizedPath = this.toUPath(path);

    if (this.mode === 'node_fs' || this.isFromNodeModules(normalizedPath)) {
      return fs.readFileSync(normalizedPath, {encoding: 'utf-8'});
    } else {
      const fileContent = this.data.get(normalizedPath) ?? null;

      if (fileContent === null) {
        return fs.readFileSync(normalizedPath, {encoding: 'utf-8'});
      }

      return fileContent;
    }
  }

  static getAllFilePaths(): string[] {
    return Array.from(this.data.keys());
  }

  private static toUPath(path: string): string {
    return upath.normalize(path);
  }

  private static isFromNodeModules(path: string): boolean {
    return minimatch(path, '**/node_modules/**');
  }

  private static async readFileAsync(filePath: string): Promise<string | null> {
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile()) {
      return fs.promises.readFile(filePath, {encoding: 'utf-8'});
    }

    return null;
  }

  private static globAsync(pattern: string, options: IOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(pattern, options, (err, matches) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(matches);
        }
      });
    });
  }
}
