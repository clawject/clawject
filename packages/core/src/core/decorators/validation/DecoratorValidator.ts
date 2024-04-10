import { AbstractCompilationMessage } from '../../../compilation-context/messages/AbstractCompilationMessage';
import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { Decorator } from '../../../api/decorators/Decorator';
import type ts from 'typescript';

export interface DecoratorValidator {
  validate(
    decorator: Decorator,
    decoratorNode: ts.Decorator,
    otherDecoratorNodes: ts.Decorator[],
    decoratorParent: DecoratorParent | null,
    decoratorTarget: DecoratorTarget
  ): AbstractCompilationMessage[];
}
