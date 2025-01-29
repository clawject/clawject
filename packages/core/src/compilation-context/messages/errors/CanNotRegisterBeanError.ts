import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import type ts from 'typescript';
import { Configuration } from '../../../core/configuration/Configuration';
import { NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { Application } from '../../../core/application/Application';
import { UnresolvedDependency } from '../../../core/dependency-resolver/ResolvedDependency';

class MissingCandidate {
  constructor(public name: string, public nodeDetails: NodeDetails) {}
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
    missingCandidates: UnresolvedDependency[]
  ) {
    super(details, place, relatedConfiguration, relatedApplication);

    this.missingCandidates = missingCandidates.map((it) => {
      return new MissingCandidate(
        it.relatedDependency.parameterName,
        it.relatedDependency.nodeDetails
      );
    });
  }
}
