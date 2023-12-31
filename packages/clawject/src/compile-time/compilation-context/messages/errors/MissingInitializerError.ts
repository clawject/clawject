import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class MissingInitializerError extends AbstractCompilationMessage {
  public code = MessageCode.CT6;
  public type = MessageType.ERROR;
  public description = 'Missing initializer.';
}
