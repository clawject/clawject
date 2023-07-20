import ts from 'typescript';
import { CONSTANTS } from '../constants';
import chalk from 'chalk';
import { isTSVersionValid } from '../ts-version/isTSVersionValid';

export const verifyTSVersion = () => {
  if (!isTSVersionValid(ts.version)) {
    throw new Error(chalk.red(`${chalk.bold(CONSTANTS.libraryName)}: incompatible typescript version - '${chalk.bold(ts.version)}', you can disable this error check by setting "unsafeTSVersion" flag in clawjects config file.`));
  }
};
