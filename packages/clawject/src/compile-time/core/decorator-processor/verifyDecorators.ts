import ts from 'typescript';
import { getDecoratorsMap } from './getDecoratorsMap';
import { DecoratorTarget } from './DecoratorTarget';
import { DecoratorRules } from './DecoratorRules';
import { DecoratorsCountError } from '../../compilation-context/messages/errors/DecoratorsCountError';
import { DecoratorKind } from './DecoratorKind';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { IncorrectArgumentsLengthError } from '../../compilation-context/messages/errors/IncorrectArgumentsLengthError';
import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';

export const verifyDecorators = (node: ts.Node, decoratorTarget: DecoratorTarget): AbstractCompilationMessage[] => {
  const errors: AbstractCompilationMessage[] = [];
  const nodeDecorators = getDecoratorsMap(node);

  //Checking compatibility between decorators
  const incompatibleNodeDecorators = Array.from(nodeDecorators.entries())
    .reduce((acc, [currentDecorator]) => {
      Array.from(nodeDecorators.entries()).forEach(([otherDecorator, decoratorExpressions]) => {
        if (decoratorExpressions.length === 0 || otherDecorator === currentDecorator) {
          return;
        }

        const values = acc.get(currentDecorator) ?? new Map<DecoratorKind, ts.Decorator>();
        acc.set(currentDecorator, values);

        const isCompatible = DecoratorRules.isCompatibleWith(currentDecorator, otherDecorator);

        if (!isCompatible) {
          values.set(otherDecorator, decoratorExpressions[0]);
        }
      });
      return acc;
    }, new Map<DecoratorKind, Map<DecoratorKind, ts.Decorator>>());

  incompatibleNodeDecorators.forEach((incompatibleDecorators, decoratorKind) => {
    incompatibleDecorators.forEach((decoratorExpression, incompatibleDecorator) => {
      incompatibleNodeDecorators.get(incompatibleDecorator)?.delete(decoratorKind);

      if (incompatibleNodeDecorators.get(incompatibleDecorator)?.size === 0) {
        incompatibleNodeDecorators.delete(incompatibleDecorator);
      }
    });
  });

  incompatibleNodeDecorators.forEach((incompatibleDecorators, decoratorKind) => {
    incompatibleDecorators.forEach((incompatibleDecoratorExpression, incompatibleDecorator) => {
      errors.push(new NotSupportedError(
        `@${decoratorKind} is not compatible with @${incompatibleDecorator}.`,
        incompatibleDecoratorExpression,
        null,
      ));
    });
  });

  //Checking decoratorsCount, argumentsCount, target compatibility
  nodeDecorators.forEach((decorators, decoratorKind) => {
    if (decorators.length === 0) {
      return;
    }

    if (decorators.length > 1) {
      errors.push(new DecoratorsCountError(
        `@${decoratorKind} was used ${decorators.length} times, but expected 1.`,
        decorators[1],
        null,
      ));
      return;
    }
    const decoratorNode = decorators[0];

    const compatibleTargets = DecoratorRules.getCompatibleTargets(decoratorKind);

    if (!compatibleTargets.has(decoratorTarget)) {
      const expectedTargets = Array.from(compatibleTargets).map(it => `'${it}'`).join(', ');
      errors.push(new NotSupportedError(
        `@${decoratorKind} is not compatible with target '${decoratorTarget}', expected targets: ${expectedTargets}.`,
        decoratorNode,
        null,
      ));
      return;
    }

    //Will check arguments count
    let args: ts.Expression[] = [];
    if (ts.isCallExpression(decoratorNode.expression)) {
      args = Array.from(decoratorNode.expression.arguments);
    }

    const argsCount = DecoratorRules.getArgumentsCount(decoratorKind);

    if (typeof argsCount === 'number') {
      if (args.length !== argsCount) {
        errors.push(new IncorrectArgumentsLengthError(
          `@${decoratorKind} was used with ${args.length} arguments, but expected ${argsCount}.`,
          decoratorNode,
          null,
        ));
      }
    } else {
      if (args.length < argsCount.min) {
        errors.push(new IncorrectArgumentsLengthError(
          `@${decoratorKind} was used with ${args.length} arguments, but expected at least ${argsCount.min}.`,
          decoratorNode,
          null,
        ));
        return;
      }

      if (args.length > argsCount.max) {
        errors.push(new IncorrectArgumentsLengthError(
          `@${decoratorKind} was used with ${args.length} arguments, but expected at most ${argsCount.max}.`,
          decoratorNode,
          null,
        ));
        return;
      }
    }

    //Will check argument static knowingness
    args.forEach((arg, index) => {
      const staticallyKnowingness = DecoratorRules.getArgumentsStaticallyKnowingness(decoratorKind);

      if (!staticallyKnowingness[index]) {
        return;
      }

      if (!ts.isStringLiteral(arg) && !ts.isNumericLiteral(arg) && !ts.isBooleanLiteral(arg)) {
        errors.push(new NotSupportedError(
          `Argument #${index} should be statically known literal.`,
          arg,
          null,
        ));
      }
    });

  });

  return errors;
};
