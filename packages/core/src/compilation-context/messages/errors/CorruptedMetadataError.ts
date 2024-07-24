import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class CorruptedMetadataError extends AbstractCompilationMessage {
  public code = ErrorCode.CE9;
  public description = 'Metadata of class is corrupted.';
}
