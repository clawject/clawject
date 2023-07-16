import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class DecoratorsCountError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT2;
  public type = MessageType.ERROR;
  public description = 'Decorator must not be used more than once on the same declaration.';
}
