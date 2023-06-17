import ts from 'typescript';
import semver from 'semver/preload';
import fs from 'fs';
import { CONSTANTS } from '../constants';
import { get } from 'lodash';
import { ConfigLoader } from '../config/ConfigLoader';
import chalk from 'chalk';

export const verifyTSVersion = () => {
    if (ConfigLoader.get().unsafeTSVersion) {
        console.log(chalk.yellow(`WARN: You are enabled "${chalk.bold('unsafeTSVersion')}" flag, ${chalk.bold(CONSTANTS.libraryName)} will not verify typescript version compatibility.`));
        return;
    }

    const packageJson = fs.readFileSync(CONSTANTS.packageJsonPath, 'utf-8');
    const packageJsonParsed = JSON.parse(packageJson);
    const tsVersion: string | undefined = get(packageJsonParsed, 'peerDependencies.typescript', undefined);

    if (!tsVersion) {
        throw new Error(chalk.red(`Required typescript version is not defined in ${chalk.red(`${CONSTANTS.libraryName}'s`)} package.json, try to reinstall ${chalk.bold(CONSTANTS.libraryName)} package.`));
    }

    if (!semver.satisfies(ts.version, tsVersion)) {
        throw new Error(chalk.red(`${chalk.bold(CONSTANTS.libraryName)} works correctly with typescript version "${chalk.bold(tsVersion)}", you have version "${chalk.bold(ts.version)}", you can disable this error check by setting "unsafeTSVersion" flag in ${chalk.bold('.clawjectrc')} config file.`));
    }
};
