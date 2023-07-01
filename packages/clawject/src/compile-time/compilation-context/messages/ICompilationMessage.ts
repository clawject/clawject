import { MessageCode } from './MessageCode';
import { MessageType } from './MessageType';
import { NodeDetails } from '../../core/ts/utils/getNodeDetails';

export interface ICompilationMessage {
    details: string | null;
    code: MessageCode
    type: MessageType
    description: string
    nodeDetails: NodeDetails;
    contextDetails: IContextDetails | null;
    filePath: string;
}

export interface IContextDetails {
    name: string;
    path: string;
    nameNodeDetails: NodeDetails;
}
