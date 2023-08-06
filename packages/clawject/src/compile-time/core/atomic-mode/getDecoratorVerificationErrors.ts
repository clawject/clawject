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

export const getDecoratorVerificationErrors = (node: ts.ClassDeclaration): AbstractCompilationMessage[] => {
  const errors: AbstractCompilationMessage[] = [];

  if (isExtendsCatContext(node)) {
    errors.push(...verifyDecorators(node, DecoratorTarget.CatContextClass));
  } else {
    errors.push(...verifyDecorators(node, DecoratorTarget.Class));
  }

  node.members.forEach(it => {
    if (isBeanFactoryMethod(it) || isBeanClassConstructor(it) || isBeanFactoryArrowFunction(it) || isBeanValueExpression(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.Bean));
      return;
    }

    if (ts.isMethodDeclaration(it) || isPropertyWithArrowFunction(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.ClassFunction));
    } else if (ts.isPropertyDeclaration(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.ClassProperty));
    }
  });

  return errors;
};
