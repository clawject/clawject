import ts, { factory } from 'typescript';
import { Configuration } from '../../configuration/Configuration';
import { createBoolean } from '../../ts/utils/createBoolean';

export function getBeanConfigObjectLiteral(context: Configuration): ts.ObjectLiteralExpression {
    const beansToDefine = Array.from(context.beanRegister.elements).filter(it =>
        it.nestedProperty === null && !it.isLifecycle()
    );

    const objectLiteralMembers: ts.PropertyAssignment[] = beansToDefine.map(bean => (
        factory.createPropertyAssignment(
            factory.createComputedPropertyName(factory.createStringLiteral(bean.classMemberName)),
            factory.createObjectLiteralExpression(
                [
                    factory.createPropertyAssignment(
                        factory.createIdentifier('scope'),
                        bean.scopeExpression.getAndDispose(),
                    ),
                    factory.createPropertyAssignment(
                        factory.createIdentifier('public'),
                        createBoolean(bean.public),
                    ),
                    factory.createPropertyAssignment(
                        factory.createIdentifier('lazy'),
                        bean.lazyExpression.getAndDispose(),
                    )
                ],
                false
            )
        )
    ));

    return factory.createObjectLiteralExpression(
        objectLiteralMembers,
        true
    );
}
