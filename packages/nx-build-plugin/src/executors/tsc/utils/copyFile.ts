import fs from 'fs';
import path from 'path';
import { promisify } from 'util';


const mkdir = promisify(fs.mkdir);
const copyFileAsync = promisify(fs.copyFile);
const stat = promisify(fs.stat);

export async function copyFile(src: string, dest: string) {
  await ensureDirectoryExistence(dest);
  await copyFileAsync(src, dest);
}

async function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  try {
    await stat(dirname);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(dirname, { recursive: true });
    } else {
      throw err;
    }
  }
}
