import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class IncorrectTypeError extends AbstractCompilationMessage {
    public code = MessageCode.CLAWJECT8;
    public type = MessageType.ERROR;
    public description = 'Incorrect type.';
}
