import ts from 'typescript';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Bean } from '../../../core/bean/Bean';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

class CycleMember {
  constructor(
    public beanName: string,
    public nodeDetails: NodeDetails,
  ) {}
}

export class CircularDependenciesError extends AbstractCompilationMessage {
  public code = MessageCode.CT7;
  public type = MessageType.ERROR;
  public description = 'Circular dependencies detected.';
  public cycleMembers: CycleMember[];

  constructor(
    place: ts.Node,
    cycleMembers: Bean[],
  ) {
    super(null, place, null);

    this.cycleMembers = cycleMembers
      .map(bean => new CycleMember(
        bean.fullName,
        getNodeDetails(bean.node.name),
      ));
  }

  cyclePresentation(positionDetailsCallback?: (cycleMember: CycleMember) => string): string {
    const cycleHead = '┌─────┐';
    const cycleMiddle = '↑     ↓';
    const cycleEnd = '└─────┘';

    const cycleMembersFormatted = this.cycleMembers
      .map((it, index) => {
        const isLast = index === this.cycleMembers.length - 1;

        let text = `|  ${it.beanName}`;

        if (positionDetailsCallback) {
          text += ` ${positionDetailsCallback(it)}`;
        }

        if (isLast) {
          return text;
        }

        return [text, cycleMiddle];
      }).flat();

    return [cycleHead, ...cycleMembersFormatted, cycleEnd].join('\n');
  }
}
