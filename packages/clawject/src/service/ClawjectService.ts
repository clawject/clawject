import { STDIOUtils } from './STDIOUtils';
import { CommandType, IServiceCommand, ServiceCommand } from './types/ServiceCommand';
import { IServiceResponse, ResponseType, } from './types/ServiceResponse';
import { FileSystemHandler } from './handlers/FileSystemHandler';
import { FileSystem } from '../file-system/FileSystem';
import { ProcessFilesHandler } from './handlers/ProcessFilesHandler';
import { IServiceErrorResponse } from './types/unknown_error/IServiceErrorResponse';
import { IServiceExitResponse } from './types/exit/IServiceExitResponse';
import { IDisposable } from './types/IDisposable';
import { IBatchFileSystemCommand } from './types/file-system/FileSystemCommands';
import { IProcessFilesCommand } from './types/process-files/IProcessFilesCommand';

export class ClawjectService implements IDisposable {
    constructor(
        private fileSystemHandler: FileSystemHandler,
        private processFilesHandler: ProcessFilesHandler,
    ) {}

    async run(): Promise<void> {
        try {
            process.stdin.on('data', this.onStdIn);
            process.on('exit', this.onExit);
            process.on('SIGINT', this.onExit);
            process.on('SIGUSR1', this.onExit);
            process.on('SIGUSR2', this.onExit);
            process.on('uncaughtException', this.onExit);

            await FileSystem.initVirtualFS();

            this.sendResponse(null, ResponseType.INIT);
        } catch (error) {
            this.onExit(error);
        }
    }

    dispose(): void {
        process.stdin.removeListener('data', this.onStdIn);
        process.removeListener('exit', this.onExit);
        process.removeListener('SIGINT', this.onExit);
        process.removeListener('SIGUSR1', this.onExit);
        process.removeListener('SIGUSR2', this.onExit);
        process.removeListener('uncaughtException', this.onExit);
    }

    private onStdIn = (buffer: Buffer): void => {
        STDIOUtils.read(buffer, this.handleData);
    };

    private handleData = async (data: string): Promise<void> => {
        try {
            const command: ServiceCommand = JSON.parse(data);

            if (this.isBatchFSCommand(command)) {
                this.fileSystemHandler.invoke(command.payload);

                return this.sendResponse(null, CommandType.FS);
            }

            if (this.isProcessFilesCommand(command)) {
                const processResult = await this.processFilesHandler.invoke(command.payload);

                return this.sendResponse(processResult, CommandType.PROCESS_FILES);
            }
        } catch (err) {
            this.sendResponse<IServiceErrorResponse>(
                {
                    details: err.message ?? null,
                    command: data,
                },
                ResponseType.ERROR,
            );
        }
    };

    private onExit = (...args: any[]): void => {
        this.sendResponse<IServiceExitResponse>(
            null,
            ResponseType.EXIT,
        );

        process.exit();
    };

    private isBatchFSCommand(command: ServiceCommand): command is IServiceCommand<CommandType.FS, IBatchFileSystemCommand> {
        return command.type === CommandType.FS;
    }

    private isProcessFilesCommand(command: ServiceCommand): command is IServiceCommand<CommandType.PROCESS_FILES, IProcessFilesCommand> {
        return command.type === CommandType.PROCESS_FILES;
    }

    private sendResponse<T extends Record<string, any>>(payload: T | null, type: CommandType | ResponseType): void {
        const response: IServiceResponse<typeof type> = {
            type: type,
            payload: payload === null ? null : JSON.stringify(payload),
        };

        STDIOUtils.write(response);
    }
}
