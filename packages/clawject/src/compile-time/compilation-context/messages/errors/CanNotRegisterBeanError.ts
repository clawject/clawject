import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';
import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import ts from 'typescript';
import { Configuration } from '../../../core/configuration/Configuration';

export class CanNotRegisterBeanError extends AbstractCompilationMessage {
  public code = MessageCode.CLAWJECT13;
  public type = MessageType.ERROR;
  public description = 'Can not register Bean.';
  public causes: AbstractCompilationMessage[];

  constructor(
    details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    causes: AbstractCompilationMessage[],
  ) {
    super(details, place, relatedConfiguration);

    this.causes = causes;
  }
}
