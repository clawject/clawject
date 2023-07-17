import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectNameError extends AbstractCompilationMessage {
  public code = MessageCode.CT1;
  public type = MessageType.ERROR;
  public description = 'Incorrect name.';
}
