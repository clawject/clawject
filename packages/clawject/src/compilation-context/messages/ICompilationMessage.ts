import { MessageCode } from './MessageCode';
import { MessageType } from './MessageType';
import { INodePosition } from '../../core/ts/utils/getPositionOfNode';

export interface ICompilationMessage {
    details: string | null;
    code: MessageCode
    type: MessageType
    description: string
    position: INodePosition;
    contextDetails: IContextDetails | null;
    filePath: string;
}

export interface IContextDetails {
    name: string;
    path: string;
    namePosition: INodePosition;
}
