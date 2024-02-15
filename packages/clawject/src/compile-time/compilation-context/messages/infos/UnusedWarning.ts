import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { InfoCode } from '../InfoCode';

export class UnusedWarning extends AbstractCompilationMessage {
  public code = InfoCode.CI1;
  public description = 'Element is not used.';
}
