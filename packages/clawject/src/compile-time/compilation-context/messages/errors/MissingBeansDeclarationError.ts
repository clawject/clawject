import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { Configuration } from '../../../core/configuration/Configuration';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { compact } from 'lodash';

class MissingElement {
  constructor(
    public name: string,
    public nodeDetails: NodeDetails,
  ) {}
}

export class MissingBeansDeclarationError extends AbstractCompilationMessage {
  public code = MessageCode.CT12;
  public type = MessageType.ERROR;
  public description = 'Missing Bean declaration.';
  public missingElementsLocations: MissingElement[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    missingElements: ts.Symbol[],
  ) {
    super(details, place, relatedConfiguration);

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
