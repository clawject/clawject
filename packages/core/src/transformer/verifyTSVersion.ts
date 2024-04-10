import { isTSVersionValid } from '../ts-version/isTSVersionValid';
import { Context } from '../compilation-context/Context';

export const verifyTSVersion = () => {
  if (!isTSVersionValid(Context.ts.version)) {
    throw new Error(`clawject: incompatible typescript version - '${Context.ts.version}', you can disable this error check by setting 'unsafeTSVersion' flag in clawject config file.`);
  }
};
