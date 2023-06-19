import ts, { factory } from 'typescript';
import { getBeanConfigObjectLiteral } from './getBeanConfigObjectLiteral';
import { Configuration } from '../../configuration/Configuration';
import { BeanKind } from '../../bean/BeanKind';
import { BeanLifecycle } from '../../../external/InternalCatContext';
import { compact } from 'lodash';
import { ConfigLoader } from '../../../config/ConfigLoader';

export const enrichWithAdditionalProperties = (node: ts.ClassDeclaration, context: Configuration): ts.ClassDeclaration => {
    const contextName = ConfigLoader.get().features.keepContextNames && context.name ?
        factory.createStringLiteral(context.name)
        : undefined;
    const beanConfigProperty = getBeanConfigObjectLiteral(context);
    const lifecycleConfigProperty = getLifecycleConfigProperty(context);

    const staticInitBlock = factory.createClassStaticBlockDeclaration(factory.createBlock(
        [factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
                factory.createIdentifier('Object'),
                factory.createIdentifier('defineProperty')
            ),
            undefined,
            [
                factory.createThis(),
                factory.createStringLiteral('clawject_static'),
                factory.createObjectLiteralExpression(
                    [factory.createPropertyAssignment(
                        factory.createIdentifier('get'),
                        factory.createArrowFunction(
                            undefined,
                            undefined,
                            [],
                            undefined,
                            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            factory.createParenthesizedExpression(factory.createObjectLiteralExpression(
                                compact([
                                    contextName && factory.createPropertyAssignment(
                                        factory.createIdentifier('contextName'),
                                        contextName
                                    ),
                                    beanConfigProperty && factory.createPropertyAssignment(
                                        factory.createIdentifier('beanConfiguration'),
                                        beanConfigProperty
                                    ),
                                    lifecycleConfigProperty && factory.createPropertyAssignment(
                                        factory.createIdentifier('lifecycleConfiguration'),
                                        lifecycleConfigProperty
                                    )
                                ]),
                                false
                            ))
                        )
                    )],
                    true
                )
            ]
        ))],
        true
    ));

    return factory.updateClassDeclaration(
        node,
        node.modifiers,
        node.name,
        node.typeParameters,
        node.heritageClauses,
        [
            staticInitBlock,
            ...node.members,
        ]
    );
};

const getLifecycleConfigProperty = (context: Configuration): ts.ObjectLiteralExpression | null => {
    const lifecycleBeanData: Record<BeanLifecycle, string[]> = {
        'post-construct': [],
        'before-destruct': [],
    };

    context.beanRegister.elements.forEach(bean => {
        if (bean.kind === BeanKind.LIFECYCLE_METHOD || bean.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION) {
            bean.lifecycle?.forEach(lifecycle => {
                lifecycleBeanData[lifecycle].push(bean.classMemberName);
            });
        }
    });

    if (Object.values(lifecycleBeanData).every(it => it.length === 0)) {
        return null;
    }

    const propertyAssignments = compact(
        Object.entries(lifecycleBeanData).map(([lifecycle, methodNames]) => {
            if (methodNames.length === 0) {
                return null;
            }

            return factory.createPropertyAssignment(
                factory.createStringLiteral(lifecycle),
                factory.createArrayLiteralExpression(
                    methodNames.map(it => factory.createStringLiteral(it)),
                    false
                )
            );
        })
    );

    return factory.createObjectLiteralExpression(
        propertyAssignments,
        false,
    );
};
