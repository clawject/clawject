import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class IncorrectArgumentsLengthError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT9;
  public type = MessageType.ERROR;
  public description = 'Incorrect arguments length.';
}
