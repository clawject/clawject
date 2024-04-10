import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class UnexpectedError extends AbstractCompilationMessage {
  public code = ErrorCode.CE0;
  public description = 'UnexpectedError. This should never happen. Please report this as a bug.';
}
