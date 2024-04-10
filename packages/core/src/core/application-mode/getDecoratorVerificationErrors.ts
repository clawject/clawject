import type * as ts from 'typescript';

import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { DecoratorVerifier } from '../decorators/DecoratorVerifier';

export const getDecoratorVerificationErrors = (node: ts.ClassDeclaration): AbstractCompilationMessage[] => {
  const classErrors = DecoratorVerifier.invoke(node);

  if (node.getText().includes('class A ')) {
    classErrors;
  }

  if (classErrors.length > 0) {
    return classErrors;
  }

  return node.members.map(it => DecoratorVerifier.invoke(it)).flat();
};
