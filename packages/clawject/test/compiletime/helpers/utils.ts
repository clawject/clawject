import * as fs from 'fs';
import * as path from 'path';

export const getFile = (dirname: string, fileName: string, parameters: Record<string, string>): string => {
  const fileContent = fs.readFileSync(path.join(dirname, 'fs', fileName), 'utf8');

  return Object.entries(parameters).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`\\$${key}`, 'g'), value);
  }, fileContent);
};
