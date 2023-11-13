import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class DuplicateDecoratorError extends AbstractCompilationMessage {
  public code = MessageCode.CT2;
  public type = MessageType.ERROR;
  public description = 'Decorator must not be used more than once on the same declaration.';
}
