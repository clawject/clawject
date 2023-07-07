import { Dependency, DependencyQualifiedBean } from '../../dependency/Dependency';
import ts, { factory } from 'typescript';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';

export const getDependencyAccessExpression = (dependency: Dependency): ts.Expression | undefined => {
    const qualifiedBean = dependency.qualifiedBean;
    const qualifiedBeans = dependency.qualifiedBeans;

    //If qualifiedBeans are not null - that means that it's a collection
    if (qualifiedBeans !== null) {
        if (dependency.diType.isArray) {
            const callExpressionsForBeans = qualifiedBeans.map(qualifiedBean => {
                return getBeanAccessExpression(qualifiedBean);
            });

            return factory.createArrayLiteralExpression(
                callExpressionsForBeans,
                false
            );
        }

        if (dependency.diType.isSet) {
            const callExpressionsForBeans = qualifiedBeans.map(qualifiedBean => {
                return getBeanAccessExpression(qualifiedBean);
            });

            return factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ContextManager),
                    factory.createIdentifier('createSet')
                ),
                undefined,
                [factory.createArrayLiteralExpression(
                    callExpressionsForBeans,
                    false
                )]
            );
        }

        if (dependency.diType.isMapStringToAny) {
            const callExpressionsForBeans = qualifiedBeans.map(qualifiedBean => {
                return factory.createArrayLiteralExpression(
                    [
                        factory.createStringLiteral(qualifiedBean.fullName),
                        getBeanAccessExpression(qualifiedBean)
                    ],
                    false
                );
            });

            return factory.createCallExpression(
                factory.createPropertyAccessExpression(
                    InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ContextManager),
                    factory.createIdentifier('createMap')
                ),
                undefined,
                [factory.createArrayLiteralExpression(
                    callExpressionsForBeans,
                    false
                )]
            );
        }
    }

    if (qualifiedBean !== null) {
        return getBeanAccessExpression(qualifiedBean);
    }

    if (dependency.diType.isOptionalUndefined || dependency.diType.isVoidUndefinedPlainUnionIntersection) {
        return factory.createIdentifier('undefined');
    }

    if (dependency.diType.isOptionalNull || dependency.diType.isNull) {
        return factory.createNull();
    }

    return undefined;
};

function getBeanAccessExpression(qualifiedBean: DependencyQualifiedBean): ts.Expression {
    let beanAccessExpression: ts.Expression = factory.createCallExpression(
        factory.createPropertyAccessExpression(
            InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ContextManager),
            factory.createIdentifier('getPrivateBeanFromFactory')
        ),
        undefined,
        [
            factory.createStringLiteral(qualifiedBean.bean.classMemberName),
            factory.createThis()
        ]
    );

    if (qualifiedBean.embeddedName !== null) {
        beanAccessExpression = factory.createElementAccessExpression(
            beanAccessExpression,
            factory.createStringLiteral(qualifiedBean.embeddedName),
        );
    }

    return beanAccessExpression;
}
