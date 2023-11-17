import { Dependency } from '../../dependency/Dependency';
import ts, { factory } from 'typescript';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { Bean } from '../../bean/Bean';

export const getDependencyAccessExpression = (dependency: Dependency): ts.Expression | undefined => {
  const qualifiedBean = dependency.qualifiedBean;
  const qualifiedBeans = dependency.qualifiedBeans;

  //If qualifiedBeans are not null - that means that it's a collection
  if (qualifiedBeans !== null) {
    let builderMethodName: string;

    if (dependency.diType.isArray) {
      builderMethodName = 'beanArray';
    } else if (dependency.diType.isSet) {
      builderMethodName = 'beanSet';
    } else if (dependency.diType.isMapStringToAny) {
      builderMethodName = 'beanMap';
    } else {
      throw Error('Unknown collection type met while building dependency access expression');
    }

    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.Utils),
        factory.createIdentifier(builderMethodName)
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          qualifiedBeans.map(qualifiedBean => (
            factory.createArrayLiteralExpression(
              createBeanExpressionsArray(qualifiedBean),
            )
          )),
          true
        ),
        factory.createIdentifier('instance')
      ]
    );
  }

  if (qualifiedBean !== null) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.Utils),
        factory.createIdentifier('bean')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          createBeanExpressionsArray(qualifiedBean),
        ),
        factory.createIdentifier('instance')
      ]
    );
  }

  if (dependency.diType.isOptionalUndefined || dependency.diType.isVoidUndefinedPlainUnionIntersection) {
    return factory.createIdentifier('undefined');
  }

  if (dependency.diType.isOptionalNull || dependency.diType.isNull) {
    return factory.createNull();
  }

  return undefined;
};


function createBeanExpressionsArray(qualifiedBean: Bean): ts.Expression[] {
  const classMemberName = factory.createStringLiteral(qualifiedBean.classMemberName);

  if (qualifiedBean.nestedProperty !== null) {
    return [
      classMemberName,
      factory.createStringLiteral(qualifiedBean.nestedProperty),
      factory.createStringLiteral(qualifiedBean.fullName)
    ];
  }

  return [classMemberName];
}
