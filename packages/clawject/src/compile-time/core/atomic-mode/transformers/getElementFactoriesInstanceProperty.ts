import { Configuration } from '../../configuration/Configuration';
import ts, { factory } from 'typescript';
import { InstanceRuntimeElement } from '../../../../runtime/runtime-elements/InstanceRuntimeElement';
import { compact } from 'lodash';
import { getDependencyAccessExpression } from './getDependencyAccessExpression';
import { BeanKind } from '../../bean/BeanKind';

export const getElementFactoriesInstanceProperty = (context: Configuration): ts.PropertyDeclaration => {
  const propertyAssignments = Array.from(context.beanRegister.elements)
    //Skipping Embedded beans
    .filter(it => it.nestedProperty === null)
    .map(bean => {
      const dependencyValueExpressions = compact(Array.from(bean.dependencies)
        .map(it => getDependencyAccessExpression(it)));

      let elementAccessExpression: ts.Expression = factory.createElementAccessExpression(
        factory.createThis(),
        factory.createStringLiteral(bean.classMemberName)
      );

      if (bean.kind !== BeanKind.VALUE_EXPRESSION) {
        elementAccessExpression = factory.createCallExpression(
          elementAccessExpression,
          undefined,
          dependencyValueExpressions
        );
      }

      return factory.createPropertyAssignment(
        factory.createIdentifier(bean.classMemberName),
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          elementAccessExpression
        )
      );
    });

  return factory.createPropertyDeclaration(
    undefined,
    factory.createIdentifier(InstanceRuntimeElement.CONTEXT_ELEMENT_FACTORIES),
    undefined,
    undefined,
    factory.createObjectLiteralExpression(
      propertyAssignments,
      true
    )
  );

};
