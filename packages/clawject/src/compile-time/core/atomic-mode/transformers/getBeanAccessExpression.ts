import ts, { factory } from 'typescript';
import { Bean } from '../../bean/Bean';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';

export const getBeanAccessExpression = (bean: Bean): ts.Expression => {
    let beanAccessExpression: ts.Expression = factory.createCallExpression(
        factory.createPropertyAccessExpression(
            InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ContextManager),
            factory.createIdentifier('getPrivateBeanFromFactory')
        ),
        undefined,
        [
            factory.createStringLiteral(bean.classMemberName),
            factory.createThis()
        ]
    );

    if (bean.nestedProperty !== null) {
        beanAccessExpression = factory.createPropertyAccessExpression(
            beanAccessExpression,
            factory.createIdentifier(bean.nestedProperty),
        );
    }

    return beanAccessExpression;
};
