import { FSCommandType } from './FSCommandType';

export interface IDeleteFileCommand {
    type: FSCommandType.DELETE;
    path: string;
}

export interface IAddFileCommand {
    type: FSCommandType.ADD;
    path: string;
    content: string;
}

export interface IMoveFileCommand {
    type: FSCommandType.MOVE;
    oldPath: string;
    newPath: string;
    content: string;
}

export interface IBatchFileSystemCommand {
    commands: Array<IAddFileCommand | IDeleteFileCommand | IMoveFileCommand>;
}
