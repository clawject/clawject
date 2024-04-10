import { ErrorCode } from '../ErrorCode';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';

export class TypeQualifyError extends AbstractCompilationMessage {
  public code = ErrorCode.CE3;
  public description = 'Can not qualify type.';
}
