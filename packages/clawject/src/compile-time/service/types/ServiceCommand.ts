import { IBatchFileSystemCommand } from './file-system/FileSystemCommands';
import { IProcessFilesCommand } from './process-files/IProcessFilesCommand';

export interface IServiceCommand<T extends CommandType, P = null> {
    type: T;
    payload: P;
}

export enum CommandType {
    FS = 'FS',
    PROCESS_FILES = 'PROCESS_FILES',
}

export type ServiceCommand =
    | IServiceCommand<CommandType.FS, IBatchFileSystemCommand>
    | IServiceCommand<CommandType.PROCESS_FILES, IProcessFilesCommand>
