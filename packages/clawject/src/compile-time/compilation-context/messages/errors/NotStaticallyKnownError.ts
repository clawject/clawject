import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class NotStaticallyKnownError extends AbstractCompilationMessage {
  public code = ErrorCode.CE15;
  public description = 'Element should be statically known.';
}
