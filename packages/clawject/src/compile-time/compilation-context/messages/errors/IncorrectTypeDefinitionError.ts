import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class IncorrectTypeDefinitionError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT4;
  public type = MessageType.ERROR;
  public description = 'Incorrect type definition.';
}
