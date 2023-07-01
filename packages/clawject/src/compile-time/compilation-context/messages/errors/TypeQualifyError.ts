import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import { MessageCode } from '../MessageCode';
import { MessageType } from '../MessageType';

export class TypeQualifyError extends AbstractCompilationMessage {
    public code = MessageCode.CLAWJECT3;
    public type = MessageType.ERROR;
    public description = 'Can not qualify type.';
}
