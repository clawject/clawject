import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class DependencyResolvingError extends AbstractCompilationMessage {
  public code = ErrorCode.CE10;
  public description = 'Can not resolve dependency.';
}
