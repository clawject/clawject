import ts, { factory } from 'typescript';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { Bean } from '../../bean/Bean';
import { ResolvedDependency } from '../../dependency/ResolvedDependency';
import { isNotEmpty } from '../../utils/isNotEmpty';

//This function should be used only in atomic mode because of Dependency type casting
export const getDependencyAccessExpression = (resolvedDependency: ResolvedDependency): ts.Expression | undefined => {
  const qualifiedBean = resolvedDependency.qualifiedBean as Bean | null;
  const qualifiedBeans = resolvedDependency.qualifiedCollectionBeans as Bean[] | null;

  //If qualifiedBeans are not null - that means that it's a collection
  if (qualifiedBeans !== null) {
    let builderMethodName: string;

    if (resolvedDependency.dependency.diType.isArray) {
      builderMethodName = 'beanArray';
    } else if (resolvedDependency.dependency.diType.isSet) {
      builderMethodName = 'beanSet';
    } else if (resolvedDependency.dependency.diType.isMapStringToAny) {
      builderMethodName = 'beanMap';
    } else {
      throw Error('Unknown collection type met while building dependency access expression');
    }

    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
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
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
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

  if (resolvedDependency.dependency.diType.isOptionalUndefined || resolvedDependency.dependency.diType.isVoidUndefinedPlainUnionIntersection) {
    return factory.createIdentifier('undefined');
  }

  if (resolvedDependency.dependency.diType.isOptionalNull || resolvedDependency.dependency.diType.isNull) {
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
    ].filter(isNotEmpty);
  }

  return [classMemberName];
}
