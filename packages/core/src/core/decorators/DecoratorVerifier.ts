import type ts from 'typescript';
import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { UniquenessDecoratorValidator } from './validation/UniquenessDecoratorValidator';
import { getDecorators } from '../ts/utils/getDecorators';
import { DecoratorProcessor } from './DecoratorProcessor';
import { DecoratorParent } from '../../api/decorators/DecoratorParent';
import { Context } from '../../compilation-context/Context';
import { BaseDecorators } from './BaseDecorators';
import { DecoratorTarget } from '../../api/decorators/DecoratorTarget';
import { isBeanFactoryMethod } from '../ts/predicates/isBeanFactoryMethod';
import { isBeanClassConstructor } from '../ts/predicates/isBeanClassConstructor';
import { isBeanFactoryArrowFunction } from '../ts/predicates/isBeanFactoryArrowFunction';
import { isBeanValueExpression } from '../ts/predicates/isBeanValueExpression';
import { isImportClassProperty } from '../ts/predicates/isImportClassProperty';
import { isPropertyWithArrowFunction } from '../ts/predicates/isPropertyWithArrowFunction';
import { ParentDecoratorValidator } from './validation/ParentDecoratorValidator';
import { ArgumentsDecoratorValidator } from './validation/ArgumentsDecoratorValidator';
import { CompatibilityDecoratorValidator } from './validation/CompatibilityDecoratorValidator';
import { TargetDecoratorValidator } from './validation/TargetDecoratorValidator';

export class DecoratorVerifier {
  private static validators = [
    new UniquenessDecoratorValidator(),
    new ParentDecoratorValidator(),
    new ArgumentsDecoratorValidator(),
    new CompatibilityDecoratorValidator(),
    new TargetDecoratorValidator(),
  ];

  static invoke(node: ts.Node): AbstractCompilationMessage[] {
    const decoratorNodes = getDecorators(node);
    const decoratorParent = this.getDecoratorParent(node);
    const decoratorTarget = this.getDecoratorTarget(node);

    for (const decoratorNode of decoratorNodes) {
      const otherDecorators = decoratorNodes.filter(it => it !== decoratorNode);
      const decorator = DecoratorProcessor.getDecoratorByModifier(decoratorNode);
      if (!decorator) {
        continue;
      }

      for (const validator of this.validators) {
        const errors = validator.validate(decorator, decoratorNode, otherDecorators, decoratorParent, decoratorTarget);
        if (errors.length > 0) {
          return errors;
        }
      }
    }

    return [];
  }

  private static getDecoratorParent(node: ts.Node): DecoratorParent | null {
    if (Context.ts.isClassDeclaration(node)) {
      return null;
    }

    if (!Context.ts.isClassElement(node)) {
      return null;
    }

    let classParent: ts.ClassDeclaration | null = null;
    let it: ts.Node = node;

    // eslint-disable-next-line no-constant-condition
    while (!Context.ts.isSourceFile(it)) {
      if (Context.ts.isClassDeclaration(it)) {
        classParent = it;
        break;
      }

      it = it.parent;
    }

    if (!classParent) {
      return null;
    }

    const parentDecorators = getDecorators(classParent);

    const isConfigurationClass = parentDecorators.some(it => DecoratorProcessor.isDecorator(it, BaseDecorators.Configuration));
    const isApplicationClass = parentDecorators.some(it => DecoratorProcessor.isDecorator(it, BaseDecorators.ClawjectApplication));

    if (isConfigurationClass) {
      return DecoratorParent.ConfigurationClass;
    }

    if (isApplicationClass) {
      return DecoratorParent.ApplicationClass;
    }

    return DecoratorParent.AnyClass;
  }

  private static getDecoratorTarget(node: ts.Node): DecoratorTarget {
    return this.checkDecoratorTarget(
      Context.ts.isClassDeclaration(node) && DecoratorProcessor.extractDecoratorEntities(node, BaseDecorators.ClawjectApplication).length > 0,
      DecoratorTarget.ApplicationClass
    ) ||
      this.checkDecoratorTarget(
        Context.ts.isClassDeclaration(node) && DecoratorProcessor.extractDecoratorEntities(node, BaseDecorators.Configuration).length > 0,
        DecoratorTarget.ConfigurationClass
      ) ||
      this.checkDecoratorTarget(
        Context.ts.isClassDeclaration(node),
        DecoratorTarget.Class
      ) ||
      this.checkDecoratorTarget(
        isBeanFactoryMethod(node) || isBeanClassConstructor(node) || isBeanFactoryArrowFunction(node) || isBeanValueExpression(node),
        DecoratorTarget.Bean
      ) ||
      this.checkDecoratorTarget(
        isImportClassProperty(node),
        DecoratorTarget.Import
      ) ||
      this.checkDecoratorTarget(
        Context.ts.isMethodDeclaration(node) || isPropertyWithArrowFunction(node),
        DecoratorTarget.ClassFunction
      ) ||
      this.checkDecoratorTarget(
        Context.ts.isPropertyDeclaration(node),
        DecoratorTarget.ClassProperty
      ) ||
      DecoratorTarget.Unknown;
  }

  private static checkDecoratorTarget(expression: boolean, target: DecoratorTarget): false | DecoratorTarget {
    return expression && target;
  }
}
