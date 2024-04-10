import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectNameError extends AbstractCompilationMessage {
  public code = ErrorCode.CE1;
  public description = 'Incorrect name.';
}
