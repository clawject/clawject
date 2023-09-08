import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import ts from 'typescript';
import { Configuration } from '../../../core/configuration/Configuration';
import { NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Dependency } from '../../../core/dependency/Dependency';

class MissingCandidate {
  constructor(
    public name: string,
    public nodeDetails: NodeDetails,
  ) {}
}

export class CanNotRegisterBeanError extends AbstractCompilationMessage {
  public code = MessageCode.CT15;
  public type = MessageType.ERROR;
  public description = 'Can not register Bean.';
  public missingCandidates: MissingCandidate[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    missingCandidates: Dependency[],
  ) {
    super(details, place, relatedConfiguration);

    this.missingCandidates = missingCandidates.map(it => {
      return new MissingCandidate(
        it.parameterName,
        it.nodeDetails,
      );
    });
  }
}
