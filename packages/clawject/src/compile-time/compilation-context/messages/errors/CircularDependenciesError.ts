import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class CircularDependenciesError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT16;
  public type = MessageType.ERROR;
  public description = 'Circular dependencies detected.';
}
