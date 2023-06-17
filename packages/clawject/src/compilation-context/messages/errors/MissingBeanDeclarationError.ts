import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class MissingBeanDeclarationError extends AbstractCompilationMessage {
    public code = MessageCode.CLAWJECT5;
    public type = MessageType.ERROR;
    public description = 'Missing Bean declaration.';
}
