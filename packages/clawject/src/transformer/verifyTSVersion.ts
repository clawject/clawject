import ts from 'typescript';
import { isTSVersionValid } from '../ts-version/isTSVersionValid';

export const verifyTSVersion = () => {
  if (!isTSVersionValid(ts.version)) {
    throw new Error(`clawject: incompatible typescript version - '${ts.version}', you can disable this error check by setting 'unsafeTSVersion' flag in clawject config file.`);
  }
};
