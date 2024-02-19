import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import { DiagnosticsLight } from './DiagnosticsLight';
import { sortBy } from 'lodash';

export const getFile = (dirname: string, fileName: string, parameters: Record<string, string>): string => {
  const fileContent = fs.readFileSync(path.join(dirname, 'fs', fileName), 'utf8');

  return Object.entries(parameters).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`\\$${key}`, 'g'), value);
  }, fileContent);
};

export const matchDiagnostic = (actual: ts.Diagnostic | DiagnosticsLight, expected: DiagnosticsLight): void => {
  expect(actual).toMatchObject(expected);
};

export const matchDiagnostics = (actual: ts.Diagnostic[], expected: DiagnosticsLight[]): void => {
  const actualLight = buildDiagnostics(actual);
  const sortedActual = sortBy(
    actualLight,
    'messageText',
    'start',
  );
  const sortedExpected = sortBy(
    expected,
    'messageText',
    'start',
  );

  expect(sortedActual).toHaveLength(sortedExpected.length);

  sortedActual.forEach((it, index) => {
    try {
      matchDiagnostic(it, sortedExpected[index]);
    } catch (error) {
      if (error instanceof Error) {
        error.message = `Diagnostic at index ${index} does not match: ${error.message}`;
      }

      throw error;
    }
  });
};

export function buildDiagnostics(diagnostics: ts.Diagnostic[]): DiagnosticsLight[] {
  return diagnostics.map(it => ({
    messageText: it.messageText,
    start: it.start,
    file: {
      fileName: it.file?.fileName,
    },
    relatedInformation: it.relatedInformation?.map(it => ({
      messageText: it.messageText,
      start: it.start,
      file: {
        fileName: it.file?.fileName,
      },
    }))
  }));
}

export function debugDiagnostics(diagnostics: ts.Diagnostic[]): void {
  console.log(JSON.stringify(buildDiagnostics(diagnostics)));
}
