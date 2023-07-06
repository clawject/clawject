import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { PossibleBeanCandidate } from '../../../core/utils/getPossibleBeanCandidates';

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
        candidatesByName: PossibleBeanCandidate[],
        candidatesByType: PossibleBeanCandidate[],
    ) {
        super(details, node, configurationNode);

        candidatesByName.forEach(candidate => {
            this.candidatesByName.push(this.getNodeDetails(candidate));
        });
        candidatesByType.forEach(candidate => {
            this.candidatesByType.push(this.getNodeDetails(candidate));
        });
    }

    private getNodeDetails(candidate: PossibleBeanCandidate): NodeDetails {
        const nodeDetails = getNodeDetails(candidate.bean.node);

        if (candidate.embeddedName === null) {
            nodeDetails.declarationName = candidate.bean.classMemberName;
        } else {
            nodeDetails.declarationName = candidate.bean.classMemberName + '.' + candidate.embeddedName;
        }

        return nodeDetails;
    }
}
