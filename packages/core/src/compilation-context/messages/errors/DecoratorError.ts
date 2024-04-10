import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class DecoratorError extends AbstractCompilationMessage {
  public code = ErrorCode.CE2;
  public description = 'Decorator error.';
}
