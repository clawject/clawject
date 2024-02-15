import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import ts from 'typescript';
import { Configuration } from '../../../core/configuration/Configuration';
import { NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Dependency } from '../../../core/dependency/Dependency';
import { Application } from '../../../core/application/Application';

class MissingCandidate {
  constructor(
    public name: string,
    public nodeDetails: NodeDetails,
  ) {}
}

export class CanNotRegisterBeanError extends AbstractCompilationMessage {
  public code = ErrorCode.CE4;
  public description = 'Can not register Bean.';
  public missingCandidates: MissingCandidate[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    relatedApplication: Application | null,
    missingCandidates: Dependency[],
  ) {
    super(details, place, relatedConfiguration, relatedApplication);

    this.missingCandidates = missingCandidates.map(it => {
      return new MissingCandidate(
        it.parameterName,
        it.nodeDetails,
      );
    });
  }
}
