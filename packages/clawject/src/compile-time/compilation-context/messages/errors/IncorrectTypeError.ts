import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectTypeError extends AbstractCompilationMessage {
  public code = MessageCode.CT8;
  public type = MessageType.ERROR;
  public description = 'Incorrect type.';
}
