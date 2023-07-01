import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class MissingInitializerError extends AbstractCompilationMessage {
    public code = MessageCode.CLAWJECT6;
    public type = MessageType.ERROR;
    public description = 'Missing initializer.';
}
