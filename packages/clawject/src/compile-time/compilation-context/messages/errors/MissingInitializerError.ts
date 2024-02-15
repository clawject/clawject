import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class MissingInitializerError extends AbstractCompilationMessage {
  public code = ErrorCode.CE6;
  public description = 'Missing initializer.';
}
