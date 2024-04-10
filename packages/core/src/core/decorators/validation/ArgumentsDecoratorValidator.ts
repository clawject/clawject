import type ts from 'typescript';
import { AbstractCompilationMessage } from 'packages/core/src/compilation-context/messages/AbstractCompilationMessage';
import { DecoratorValidator } from './DecoratorValidator';
import { DecoratorParent } from '../../../api/decorators/DecoratorParent';
import { DecoratorTarget } from '../../../api/decorators/DecoratorTarget';
import { Decorator } from '../../../api/decorators/Decorator';
import { Context } from '../../../compilation-context/Context';
import { DecoratorError } from '../../../compilation-context/messages/errors/DecoratorError';
import { DecoratorArgument } from '../../../api/decorators/DecoratorArgumentConstraint';
import { getStaticallyKnownValue } from '../../ts/utils/getStaticallyKnownValue';

export class ArgumentsDecoratorValidator implements DecoratorValidator {
  validate(
    decorator: Decorator,
    decoratorNode: ts.Decorator,
    otherDecoratorNodes: ts.Decorator[],
    decoratorParent: DecoratorParent | null,
    decoratorTarget: DecoratorTarget
  ): AbstractCompilationMessage[] {
    const argumentsExpressions: ts.Expression[] = [];
    if (Context.ts.isCallExpression(decoratorNode.expression)) {
      argumentsExpressions.push(...decoratorNode.expression.arguments);
    }
    const decoratorArguments: DecoratorArgument[] = [];

    const errors: AbstractCompilationMessage[] = [];

    for (let index = 0; index < decorator.argumentConstraints.length; index++) {
      const argumentConstraint = decorator.argumentConstraints[index];
      const argument: ts.Expression | undefined = argumentsExpressions[index];

      if (!argument) {
        decoratorArguments[index] = new DecoratorArgument(argumentConstraint, undefined);
      } else {
        const notStaticallyKnownToken = Symbol();
        const value = getStaticallyKnownValue(argument, notStaticallyKnownToken);
        decoratorArguments[index] = new DecoratorArgument(
          argumentConstraint,
          value === notStaticallyKnownToken ? undefined : value
        );

        if (value === notStaticallyKnownToken) {
          errors.push(
            new DecoratorError(
              `@${decorator.name} from '${decorator.moduleName}' requires argument at position ${index} to be statically known.`,
              argument,
              null,
              null,
            )
          );
        }
      }

      if (!argumentConstraint.optional && !argument) {
        errors.push(
          new DecoratorError(
            `@${decorator.name} from '${decorator.moduleName}' requires argument at index ${index} to be provided.`,
            decoratorNode,
            null,
            null,
          )
        );
      }
    }

    //Fail fast
    if (errors.length > 0) {
      return errors;
    }

    const errorsArguments = decorator.validateArguments(decoratorArguments);

    errorsArguments.forEach(error => {
      errors.push(
        new DecoratorError(
          `@${decorator.name} from '${decorator.moduleName}' argument at position ${error.index} is invalid: ${error.error}.`,
          argumentsExpressions[error.index] ?? decoratorNode,
          null,
          null,
        )
      );
    });

    return errors;
  }
}
