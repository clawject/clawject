import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectArgumentsLengthError extends AbstractCompilationMessage {
  public code = MessageCode.CT9;
  public type = MessageType.ERROR;
  public description = 'Incorrect arguments length.';
}
