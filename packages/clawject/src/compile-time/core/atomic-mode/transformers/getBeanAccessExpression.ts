import ts, { factory } from 'typescript';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { DependencyQualifiedBean } from '../../dependency/Dependency';

export const getBeanAccessExpression = (qualifiedBean: DependencyQualifiedBean): ts.Expression => {
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
};
