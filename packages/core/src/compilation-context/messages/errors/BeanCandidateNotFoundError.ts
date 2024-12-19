import { ErrorCode } from '../ErrorCode';
import type * as ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { Bean } from '../../../core/bean/Bean';
import { BeanKind } from '../../../core/bean/BeanKind';
import { mapAndFilter } from '../../../core/utils/mapAndFilter';
import { isNotEmpty } from '../../../core/utils/isNotEmpty';
import { Application } from '../../../core/application/Application';

export class BeanCandidateNotFoundError extends AbstractCompilationMessage {
  public code = ErrorCode.CE5;
  public description = 'Bean candidate not found.';
  public candidatesByType: NodeDetails[];
  public beanDeclarationNodeDetails: NodeDetails | null;
  public beanKind: BeanKind | null;

  constructor(
    details: string | null,
    place: ts.Node,
    relatedBean: Bean | null,
    candidatesByType: Bean[],
    relatedApplication: Application,
  ) {
    super(details, place, relatedBean?.parentConfiguration ?? null, relatedApplication);

    this.candidatesByType = mapAndFilter(candidatesByType, it => this.getNodeDetails(it), isNotEmpty);
    this.beanDeclarationNodeDetails = relatedBean === null ? null : getNodeDetails(relatedBean.node);
    this.beanKind = relatedBean?.kind ?? null;
  }

  private getNodeDetails(bean: Bean | null): NodeDetails | null {
    if (bean === null) {
      return null;
    }

    const nodeDetails = getNodeDetails(bean.node);

    nodeDetails.declarationName = bean.fullName;

    return nodeDetails;
  }
}
