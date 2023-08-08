import ts from 'typescript';

import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { verifyDecorators } from '../decorator-processor/verifyDecorators';
import { DecoratorTarget } from '../decorator-processor/DecoratorTarget';
import { isPropertyWithArrowFunction } from '../ts/predicates/isPropertyWithArrowFunction';
import { isExtendsCatContext } from '../ts/predicates/isExtendsCatContext';
import { isBeanFactoryMethod } from '../ts/predicates/isBeanFactoryMethod';
import { isBeanClassConstructor } from '../ts/predicates/isBeanClassConstructor';
import { isBeanFactoryArrowFunction } from '../ts/predicates/isBeanFactoryArrowFunction';
import { isBeanValueExpression } from '../ts/predicates/isBeanValueExpression';
import { DecoratorParent } from '../decorator-processor/DecoratorParent';
import { isDecoratorFromLibrary } from '../decorator-processor/isDecoratorFromLibrary';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { getDecorators } from '../ts/utils/getDecorators';

export const getDecoratorVerificationErrors = (node: ts.ClassDeclaration): AbstractCompilationMessage[] => {
  const errors: AbstractCompilationMessage[] = [];

  const isCatContext = isExtendsCatContext(node);
  const classDecorators = getDecorators(node);

  let decoratorParent: DecoratorParent;

  if (isCatContext) {
    decoratorParent = DecoratorParent.CatContextClass;
  } else if (classDecorators.some(it => isDecoratorFromLibrary(it, DecoratorKind.Configuration))) {
    decoratorParent = DecoratorParent.ConfigurationClass;
  } else if (classDecorators.some(it => isDecoratorFromLibrary(it, DecoratorKind.Component))) {
    decoratorParent = DecoratorParent.ComponentClass;
  } else {
    decoratorParent = DecoratorParent.AnyClass;
  }

  if (isCatContext) {
    errors.push(...verifyDecorators(node, DecoratorTarget.CatContextClass, null));
  } else {
    errors.push(...verifyDecorators(node, DecoratorTarget.Class, null));
  }

  node.members.forEach(it => {
    if (isBeanFactoryMethod(it) || isBeanClassConstructor(it) || isBeanFactoryArrowFunction(it) || isBeanValueExpression(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.Bean, decoratorParent));
      return;
    }

    if (ts.isMethodDeclaration(it) || isPropertyWithArrowFunction(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.ClassFunction, decoratorParent));
    } else if (ts.isPropertyDeclaration(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.ClassProperty, decoratorParent));
    }
  });

  return errors;
};
