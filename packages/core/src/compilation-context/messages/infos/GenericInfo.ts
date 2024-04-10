import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { InfoCode } from '../InfoCode';

export class GenericInfo extends AbstractCompilationMessage {
  public code = InfoCode.CI0;
  public description = 'Element is not used.';
}
