import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { Configuration } from '../../../core/configuration/Configuration';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { compact } from 'lodash';

export class TypeMismatchError extends AbstractCompilationMessage {
  public code = MessageCode.CT13;
  public type = MessageType.ERROR;
  public description = 'Type mismatch.';
  public locations: NodeDetails[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    mismatchElements: ts.Symbol[],
  ) {
    super(details, place, relatedConfiguration);

    this.locations = compact(mismatchElements.map(it => {
      return it.declarations?.map(getNodeDetails);
    }).flat());
  }
}
