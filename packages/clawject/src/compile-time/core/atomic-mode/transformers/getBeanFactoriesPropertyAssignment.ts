import { Configuration } from '../../configuration/Configuration';
import ts, { factory } from 'typescript';
import { getDependencyAccessExpression } from './getDependencyAccessExpression';
import { BeanKind } from '../../bean/BeanKind';
import { compact } from 'lodash';

export const getBeanFactoriesPropertyAssignment = (context: Configuration): ts.PropertyAssignment => {
  const propertyAssignments = Array.from(context.beanRegister.elements)
    //Skipping Embedded beans
    .filter(it => it.nestedProperty === null)
    .map(bean => {
      const dependencyValueExpressions = compact(Array.from(bean.dependencies)
        .map(it => getDependencyAccessExpression(it)));

      let elementAccessExpression: ts.Expression = factory.createPropertyAccessExpression(
        factory.createIdentifier('instance'),
        factory.createIdentifier(bean.classMemberName)
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

  return factory.createPropertyAssignment(
    factory.createIdentifier('factories'),
    factory.createObjectLiteralExpression(
      propertyAssignments,
      true
    )
  );
};
