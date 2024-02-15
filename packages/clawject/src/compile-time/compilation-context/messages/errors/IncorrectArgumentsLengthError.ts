import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectArgumentsLengthError extends AbstractCompilationMessage {
  public code = ErrorCode.CE9;
  public description = 'Incorrect arguments length.';
}
