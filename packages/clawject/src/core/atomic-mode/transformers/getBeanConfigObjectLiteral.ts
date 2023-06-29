import ts, { factory } from 'typescript';
import { Configuration } from '../../configuration/Configuration';
import { compact } from 'lodash';

export function getBeanConfigObjectLiteral(context: Configuration): ts.ObjectLiteralExpression {
    const notNestedContextBeans = Array.from(context.beanRegister.elements).filter(it => it.nestedProperty === null);

    const objectLiteralMembers: ts.PropertyAssignment[] = notNestedContextBeans.map(bean => (
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
                        factory.createTrue(),
                    ),
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
