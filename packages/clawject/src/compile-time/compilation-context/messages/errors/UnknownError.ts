import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class UnknownError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT0;
  public type = MessageType.ERROR;
  public description = 'Unknown error.';
}
