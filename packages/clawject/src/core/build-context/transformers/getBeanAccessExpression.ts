import ts, { factory } from 'typescript';
import { ContextBean } from '../../bean/ContextBean';

export const getBeanAccessExpression = (bean: ContextBean): ts.Expression => {
    let beanAccessExpression: ts.Expression = factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createThis(),
            factory.createIdentifier('clawject_getPrivateBean')
        ),
        undefined,
        [factory.createStringLiteral(bean.classMemberName)]
    );

    if (bean.nestedProperty !== null) {
        beanAccessExpression = factory.createPropertyAccessExpression(
            beanAccessExpression,
            factory.createIdentifier(bean.nestedProperty),
        );
    }

    return beanAccessExpression;
};
