import ts, { factory } from 'typescript';
import { Bean } from '../../bean/Bean';
import { RuntimeElement } from '../../runtime-element/RuntimeElement';

export const getBeanAccessExpression = (bean: Bean): ts.Expression => {
    let beanAccessExpression: ts.Expression = factory.createCallExpression(
        factory.createPropertyAccessExpression(
            factory.createThis(),
            factory.createIdentifier(RuntimeElement.GET_PRIVATE_BEAN)
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
