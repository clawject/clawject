import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import ts from 'typescript';
import { Configuration } from '../../../core/configuration/Configuration';
import { Bean } from '../../../core/bean/Bean';
import { NodeDetails } from '../../../core/ts/utils/getNodeDetails';

class DuplicateElement {
  constructor(
    public name: string,
    public location: NodeDetails,
  ) {}
}

export class DuplicateNameError extends AbstractCompilationMessage {
  public code = MessageCode.CT14;
  public type = MessageType.ERROR;
  public description = 'Duplicate name.';
  public duplicateElements: DuplicateElement[] = [];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    relatedBeans: Bean[]
  ) {
    super(details, place, relatedConfiguration);

    this.duplicateElements = relatedBeans.map(bean => new DuplicateElement(
      bean.fullName,
      bean.nameNodeDetails ?? bean.nodeDetails,
    ));
  }
}
