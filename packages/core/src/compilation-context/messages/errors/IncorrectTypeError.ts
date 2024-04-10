import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectTypeError extends AbstractCompilationMessage {
  public code = ErrorCode.CE8;
  public description = 'Incorrect type.';
}
