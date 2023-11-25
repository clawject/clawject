import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { Configuration } from '../../../core/configuration/Configuration';
import ts from 'typescript';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Bean } from '../../../core/bean/Bean';
import { compact } from 'lodash';

class BeanTypeMismatch {
  constructor(
    public name: string,
    public location: NodeDetails,
  ) {}
}

export class TypeMismatchError extends AbstractCompilationMessage {
  public code = MessageCode.CT13;
  public type = MessageType.ERROR;
  public description = 'Type mismatch.';
  public mismatchElements: BeanTypeMismatch[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    mismatchElements: Bean[],
  ) {
    super(details, place, relatedConfiguration);

    this.mismatchElements = compact(mismatchElements.map(it => {
      return new BeanTypeMismatch(
        it.fullName,
        getNodeDetails(it.node)
      );
    }));
  }
}
