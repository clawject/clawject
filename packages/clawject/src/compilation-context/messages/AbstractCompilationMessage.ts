import ts from 'typescript';
import { MessageCode } from './MessageCode';
import { unquoteString } from '../../core/utils/unquoteString';
import { getPositionOfNode, INodePosition } from '../../core/ts/utils/getPositionOfNode';
import { MessageType } from './MessageType';
import { ICompilationMessage, IContextDetails } from './ICompilationMessage';
import { getNameFromDeclarationOrNull } from '../../core/ts/utils/getNameFromDeclarationOrNull';

export abstract class AbstractCompilationMessage implements ICompilationMessage {
    public abstract code: MessageCode
    public abstract type: MessageType
    public abstract description: string
    public readonly position: INodePosition;
    public readonly contextDetails: IContextDetails | null;
    public readonly filePath: string;

    public constructor(
        public details: string | null,
        node: ts.Node,
        configurationNode: ts.ClassDeclaration | null
    ) {
        this.position = getPositionOfNode(node);
        this.filePath = node.getSourceFile().fileName;
        this.contextDetails = this.getContextDetails(configurationNode);
    }

    private getContextDetails(contextNode: ts.ClassDeclaration | null): IContextDetails | null {
        if (contextNode === null) {
            return null;
        }

        const contextName = getNameFromDeclarationOrNull(contextNode) ?? '<anonymous>';

        return {
            name: unquoteString(contextName),
            path: contextNode.getSourceFile().fileName,
            namePosition: getPositionOfNode(contextNode.name ?? contextNode),
        };
    }
}
