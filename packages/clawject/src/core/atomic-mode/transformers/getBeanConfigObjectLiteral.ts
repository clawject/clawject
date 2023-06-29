import ts, { factory } from 'typescript';
import { Configuration } from '../../configuration/Configuration';
import { compact } from 'lodash';
import { createBoolean } from '../../ts/utils/createBoolean';

export function getBeanConfigObjectLiteral(context: Configuration): ts.ObjectLiteralExpression {
    const beansToDefine = Array.from(context.beanRegister.elements).filter(it =>
        it.nestedProperty === null && !it.isLifecycle()
    );

    const objectLiteralMembers: ts.PropertyAssignment[] = beansToDefine.map(bean => (
        factory.createPropertyAssignment(
            factory.createComputedPropertyName(factory.createStringLiteral(bean.classMemberName)),
            factory.createObjectLiteralExpression(
                compact([
                    bean.scope === 'singleton'
                        ? null
                        : factory.createPropertyAssignment(
                            factory.createIdentifier('scope'),
                            factory.createStringLiteral(bean.scope)
                        ),
                    bean.public && factory.createPropertyAssignment(
                        factory.createIdentifier('public'),
                        createBoolean(true),
                    ),
                    factory.createPropertyAssignment(
                        factory.createIdentifier('lazy'),
                        createBoolean(bean.lazy),
                    )
                ]),
                false
            )
        )
    ));

    return factory.createObjectLiteralExpression(
        objectLiteralMembers,
        true
    );
}
