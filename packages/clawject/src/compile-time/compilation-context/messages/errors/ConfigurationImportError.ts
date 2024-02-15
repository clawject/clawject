import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class ConfigurationImportError extends AbstractCompilationMessage {
  public code = ErrorCode.CE13;
  public description = 'Could not import configuration.';
}
