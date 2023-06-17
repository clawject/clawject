import { IServiceResponse } from './types/ServiceResponse';

export class STDIOUtils {

    private static stdinBuffer = '';

    static read = (buffer: Buffer, onReadComplete: (data: string) => void): void => {
        const bufferString = buffer.toString();

        if (!bufferString.endsWith('\n')) {
            this.stdinBuffer += bufferString;

            return;
        }

        const resultData = this.stdinBuffer + bufferString;

        this.stdinBuffer = '';

        onReadComplete(resultData);
    };

    static write<T extends IServiceResponse<any>>(data: T): void {
        process.stdout.write(JSON.stringify(data) + '\n');
    }
}
