import { ErrorCode } from '../ErrorCode';
import type * as ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { Application } from '../../../core/application/Application';

export class BeanExposingError extends AbstractCompilationMessage {
  public code = ErrorCode.CE12;
  public description = 'Could not expose beans.';
  public problemNodes: NodeDetails[] = [];

  constructor(
    details: string | null,
    place: ts.Node,
    problemProperties: ts.Symbol[],
    relatedApplication: Application,
  ) {
    super(details, place, null, relatedApplication);

    problemProperties.forEach(property => {
      const propertyDeclaration = property.valueDeclaration;

      if (!propertyDeclaration) {
        return;
      }

      const nodeDetails = getNodeDetails(propertyDeclaration);

      this.problemNodes.push(nodeDetails);
    });
  }
}
