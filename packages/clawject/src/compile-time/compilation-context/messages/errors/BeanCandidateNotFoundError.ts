import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
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
    relatedBean: Bean,
    candidatesByName: Bean[],
    candidatesByType: Bean[],
  ) {
    super(details, place, relatedBean.parentConfiguration);

    this.candidatesByName = candidatesByName.map(it => this.getNodeDetails(it));
    this.candidatesByType = candidatesByType.map(it => this.getNodeDetails(it));
    this.beanDeclarationNodeDetails = getNodeDetails(relatedBean.node);
    this.beanKind = relatedBean.kind;
  }

  private getNodeDetails(bean: Bean): NodeDetails {
    const nodeDetails = getNodeDetails(bean.node);

    nodeDetails.declarationName = bean.fullName;

    return nodeDetails;
  }
}
