import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import ts from 'typescript';
import { Bean } from '../../../core/bean/Bean';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';

export class MissingBeanDeclarationError extends AbstractCompilationMessage {
    public code = MessageCode.CLAWJECT5;
    public type = MessageType.ERROR;
    public description = 'Missing Bean declaration.';
    public candidatesByName: NodeDetails[] = [];
    public candidatesByType: NodeDetails[] = [];

    constructor(
        details: string | null,
        node: ts.Node,
        configurationNode: ts.ClassDeclaration | null,
        candidatesByName: Bean[],
        candidatesByType: Bean[],
    ) {
        super(details, node, configurationNode);

        candidatesByName.forEach(candidate => {
            this.candidatesByName.push(getNodeDetails(candidate.node));
        });
        candidatesByType.forEach(candidate => {
            this.candidatesByType.push(getNodeDetails(candidate.node));
        });
    }
}
