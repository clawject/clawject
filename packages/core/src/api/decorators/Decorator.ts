import { DecoratorParent } from './DecoratorParent';
import { DecoratorTarget } from './DecoratorTarget';
import { DecoratorAlias } from './DecoratorAlias';
import { ClawjectDecoratorArgumentError, DecoratorArgument, DecoratorArgumentConstraint } from './DecoratorArgumentConstraint';

export abstract class Decorator {
  aliasTo: DecoratorAlias[] = [];

  abstract name: string;
  abstract moduleName: string;
  abstract uniq: boolean;

  abstract parents: DecoratorParent[];
  abstract targets: DecoratorTarget[];

  abstract argumentConstraints: DecoratorArgumentConstraint[];

  abstract validateArguments(args: DecoratorArgument[]): ClawjectDecoratorArgumentError[];

  /**
   * Null is returned in cases when the compatibility cannot be determined
   * or should be determined by the other decorator.
   */
  abstract isCompatibleWith(decorator: Decorator): boolean | null;

  abstract predicate(
    declarationFilePath: string,
  ): boolean;
}
