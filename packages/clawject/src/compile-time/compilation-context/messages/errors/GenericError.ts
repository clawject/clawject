import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class GenericError extends AbstractCompilationMessage {
  public code = MessageCode.CT0;
  public type = MessageType.ERROR;
  public description = 'GenericError';
}
