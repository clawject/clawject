import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class NotSupportedError extends AbstractCompilationMessage {
  public code = ErrorCode.CE11;
  public description = 'Not supported.';
}
