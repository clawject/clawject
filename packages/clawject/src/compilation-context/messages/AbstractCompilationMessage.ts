import ts from 'typescript';
import { MessageCode } from './MessageCode';
import { unquoteString } from '../../core/utils/unquoteString';
import { getNodeDetails, NodeDetails } from '../../core/ts/utils/getNodeDetails';
import { MessageType } from './MessageType';
import { ICompilationMessage, IContextDetails } from './ICompilationMessage';
import { getNameFromNodeOrNull } from '../../core/ts/utils/getNameFromNodeOrNull';

export abstract class AbstractCompilationMessage implements ICompilationMessage {
    public abstract code: MessageCode
    public abstract type: MessageType
    public abstract description: string
    public readonly nodeDetails: NodeDetails;
    public readonly contextDetails: IContextDetails | null;
    public readonly filePath: string;

    public constructor(
        public details: string | null,
        node: ts.Node,
        configurationNode: ts.ClassDeclaration | null
    ) {
        this.nodeDetails = getNodeDetails(node);
        this.filePath = node.getSourceFile().fileName;
        this.contextDetails = this.getContextDetails(configurationNode);
    }

    private getContextDetails(contextNode: ts.ClassDeclaration | null): IContextDetails | null {
        if (contextNode === null) {
            return null;
        }

        const contextName = getNameFromNodeOrNull(contextNode) ?? '<anonymous>';

        return {
            name: unquoteString(contextName),
            path: contextNode.getSourceFile().fileName,
            nameNodeDetails: getNodeDetails(contextNode.name ?? contextNode),
        };
    }
}
