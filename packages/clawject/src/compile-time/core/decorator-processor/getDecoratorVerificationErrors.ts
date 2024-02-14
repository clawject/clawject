import ts from 'typescript';

import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { verifyDecorators } from './verifyDecorators';
import { DecoratorTarget } from './DecoratorTarget';
import { isPropertyWithArrowFunction } from '../ts/predicates/isPropertyWithArrowFunction';
import { isBeanFactoryMethod } from '../ts/predicates/isBeanFactoryMethod';
import { isBeanClassConstructor } from '../ts/predicates/isBeanClassConstructor';
import { isBeanFactoryArrowFunction } from '../ts/predicates/isBeanFactoryArrowFunction';
import { isBeanValueExpression } from '../ts/predicates/isBeanValueExpression';
import { DecoratorParent } from './DecoratorParent';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { DecoratorKind } from './DecoratorKind';
import { getDecorators } from '../ts/utils/getDecorators';
import { isImportClassProperty } from '../ts/predicates/isImportClassProperty';

export const getDecoratorVerificationErrors = (node: ts.ClassDeclaration): AbstractCompilationMessage[] => {
  const errors: AbstractCompilationMessage[] = [];
  const classDecorators = getDecorators(node);

  const isConfigurationClass = classDecorators.some(it => isDecoratorFromLibrary(it, DecoratorKind.Configuration));
  const isApplicationClass = classDecorators.some(it => isDecoratorFromLibrary(it, DecoratorKind.ClawjectApplication));

  if (isConfigurationClass) {
    errors.push(...verifyDecorators(node, DecoratorTarget.ConfigurationClass, null));
  } else if (isApplicationClass) {
    errors.push(...verifyDecorators(node, DecoratorTarget.ApplicationClass, null));
  } else {
    errors.push(...verifyDecorators(node, DecoratorTarget.Class, null));
  }

  let decoratorParent: DecoratorParent;

  if (isConfigurationClass) {
    decoratorParent = DecoratorParent.ConfigurationClass;
  } else if (isApplicationClass) {
    decoratorParent = DecoratorParent.ApplicationClass;
  } else {
    decoratorParent = DecoratorParent.AnyClass;
  }

  node.members.forEach(it => {
    if (isImportClassProperty(it)) {
      errors.push(...verifyDecorators(it, DecoratorTarget.Import, decoratorParent));
      return;
    }

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
