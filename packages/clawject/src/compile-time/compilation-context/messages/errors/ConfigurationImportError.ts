import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class ConfigurationImportError extends AbstractCompilationMessage {
  public code = MessageCode.CT17;
  public type = MessageType.ERROR;
  public description = 'Could not import configuration.';
}
