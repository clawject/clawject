import ts, { factory } from 'typescript';
import { Context } from '../../context/Context';
import { compact } from 'lodash';

export function getBeanConfigObjectLiteral(context: Context): ts.ObjectLiteralExpression | undefined {
    if (context.beans.size === 0) {
        return undefined;
    }

    const notNestedContextBeans = Array.from(context.beans).filter(it => it.nestedProperty === null);

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
                        factory.createIdentifier('isPublic'),
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
