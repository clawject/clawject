import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class DuplicateDecoratorError extends AbstractCompilationMessage {
  public code = ErrorCode.CE2;
  public description = 'Decorator must not be used more than once on the same declaration.';
}
