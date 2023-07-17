import ts from 'typescript';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Bean } from '../../../core/bean/Bean';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { Configuration } from '../../../core/configuration/Configuration';

class CycleMember {
  constructor(
    public beanName: string,
    public nodeDetails: NodeDetails
  ) {}
}

export class CircularDependenciesError extends AbstractCompilationMessage {
  public code = MessageCode.CT7;
  public type = MessageType.ERROR;
  public description = 'Circular dependencies detected.';
  public cycleMembers: CycleMember[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    cycleMembers: Bean[],
  ) {
    super(details, place, relatedConfiguration);

    this.cycleMembers = cycleMembers.map(bean => new CycleMember(
      bean.classMemberName,
      getNodeDetails(bean.node.name)
    ));
  }
}
