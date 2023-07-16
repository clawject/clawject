import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { Configuration } from '../../../core/configuration/Configuration';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { compact } from 'lodash';

export class MissingBeansDeclaration extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT12;
  public type = MessageType.ERROR;
  public description = 'Missing Bean declaration.';
  public locations: NodeDetails[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    missingElements: ts.Symbol[],
  ) {
    super(details, place, relatedConfiguration);

    this.locations = compact(missingElements.map(it => {
      return it.declarations?.map(getNodeDetails);
    }).flat());
  }
}
