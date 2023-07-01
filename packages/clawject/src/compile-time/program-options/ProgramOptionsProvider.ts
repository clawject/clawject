import { IProgramOptions } from './IProgramOptions';
import { program } from 'commander';
import * as process from 'process';
import {merge} from 'lodash';

export class ProgramOptionsProvider {
    static options: IProgramOptions = {
        cwd: process.cwd(),
        config: null,
    };

    private static setOptions(options: Partial<IProgramOptions>): void {
        this.options = merge(this.options, options);
    }

    static init(): void {
        program
            .option('-cwd, --cwd <absolute_dir_path>', 'current working directory', 'process.cwd()')
            //TODO
            .option('-C, --config <config_file>', 'file name or relative (from cwd) path to the config file');

        program.parse();

        const options: Partial<IProgramOptions> = program.opts();

        this.setOptions(options);
    }
}
