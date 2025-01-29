import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { ErrorCode } from '../ErrorCode';
import type ts from 'typescript';
import { Configuration } from '../../../core/configuration/Configuration';
import { Bean } from '../../../core/bean/Bean';
import { NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Application } from '../../../core/application/Application';

class DuplicateElement {
  constructor(
    public name: string,
    public location: NodeDetails,
  ) {}
}

export class DuplicateNameError extends AbstractCompilationMessage {
  public code = ErrorCode.CE14;
  public description = 'Duplicate name.';
  public duplicateElements: DuplicateElement[] = [];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    relatedApplication: Application | null,
    relatedBeans: Bean[],
  ) {
    super(details, place, relatedConfiguration, relatedApplication);

    this.duplicateElements = relatedBeans.map(bean => new DuplicateElement(
      bean.fullName,
      bean.nameNodeDetails ?? bean.nodeDetails,
    ));
  }
}
