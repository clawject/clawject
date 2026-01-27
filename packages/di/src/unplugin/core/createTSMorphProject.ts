import { createProject } from '@ts-morph/bootstrap';
import { Context } from '@clawject/core/compilation-context/Context';

const ImportMap = {
  '5.0': 'ts-morph-bootstrap-ts50',
  '5.1': 'ts-morph-bootstrap-ts51',
  '5.2': 'ts-morph-bootstrap-ts52',
  '5.3': 'ts-morph-bootstrap-ts53',
  '5.4': 'ts-morph-bootstrap-ts54',
  '5.5': 'ts-morph-bootstrap-ts55',
  '5.6': 'ts-morph-bootstrap-ts56',
  '5.7': 'ts-morph-bootstrap-ts57',
  '5.8': 'ts-morph-bootstrap-ts58',
  '5.9': 'ts-morph-bootstrap-ts59',
};

export const createTSMorphProject: typeof createProject = async (...args: any[]) => {
  if (!Object.hasOwn(ImportMap, Context.ts.versionMajorMinor)) {
    throw new Error(`Unsupported TypeScript version: ${Context.ts.versionMajorMinor}`);
  }

  const module = await import(ImportMap[Context.ts.versionMajorMinor as string]);

  return module.createProject(...args) as any;
};
