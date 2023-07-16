import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class DependencyResolvingError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT10;
  public type = MessageType.ERROR;
  public description = 'Can not resolve dependency.';
}
