import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { PossibleBeanCandidate } from '../../../core/utils/getPossibleBeanCandidates';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { Configuration } from '../../../core/configuration/Configuration';
import { Bean } from '../../../core/bean/Bean';
import { BeanKind } from '../../../core/bean/BeanKind';

export class BeanCandidateNotFoundError extends AbstractCompilationMessage {
  public code = MessageCode.CT5;
  public type = MessageType.ERROR;
  public description = 'Bean candidate not found.';
  public candidatesByName: NodeDetails[];
  public candidatesByType: NodeDetails[];
  public beanDeclarationNodeDetails: NodeDetails;
  public beanKind: BeanKind;

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    relatedBean: Bean,
    candidatesByName: PossibleBeanCandidate[],
    candidatesByType: PossibleBeanCandidate[],
  ) {
    super(details, place, relatedConfiguration);

    this.candidatesByName = candidatesByName.map(it => this.getNodeDetails(it));
    this.candidatesByType = candidatesByType.map(it => this.getNodeDetails(it));
    this.beanDeclarationNodeDetails = getNodeDetails(relatedBean.node);
    this.beanKind = relatedBean.kind;
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
