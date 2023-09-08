import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class NotStaticallyKnownError extends AbstractCompilationMessage {
  public code = MessageCode.CT15;
  public type = MessageType.ERROR;
  public description = 'Element should be statically known.';
}
