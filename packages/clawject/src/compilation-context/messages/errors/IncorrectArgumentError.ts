import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class IncorrectArgumentError extends AbstractCompilationMessage {
    public code = MessageCode.CLAWJECT7;
    public type = MessageType.ERROR;
    public description = 'Incorrect argument.';
}
