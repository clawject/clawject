import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class CorruptedMetadataError extends AbstractCompilationMessage {
  public code = MessageCode.CT16;
  public type = MessageType.ERROR;
  public description = 'Metadata of class is corrupted.';
}
