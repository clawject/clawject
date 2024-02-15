import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { ErrorCode } from '../ErrorCode';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { compact } from 'lodash';
import { Application } from '../../../core/application/Application';

class MissingElement {
  constructor(
    public name: string,
    public nodeDetails: NodeDetails,
  ) {}
}

export class MissingBeansDeclarationError extends AbstractCompilationMessage {
  public code = ErrorCode.CE12;
  public description = 'Missing Bean declaration.';
  public missingElementsLocations: MissingElement[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedApplication: Application,
    missingElements: ts.Symbol[],
  ) {
    super(details, place, null, relatedApplication);

    this.missingElementsLocations = compact(missingElements.map(symbol => {
      return symbol.declarations?.map(declaration => {
        return new MissingElement(
          symbol.name,
          getNodeDetails(declaration),
        );
      });
    }).flat());
  }
}
