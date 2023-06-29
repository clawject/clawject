import ts, { factory } from 'typescript';
import { getBeanConfigObjectLiteral } from './getBeanConfigObjectLiteral';
import { Configuration } from '../../configuration/Configuration';
import { compact } from 'lodash';
import { ConfigLoader } from '../../../config/ConfigLoader';
import { LifecycleKind } from '../../component-lifecycle/LifecycleKind';
import { RuntimeElement } from '../../runtime-element/RuntimeElement';

export const enrichWithAdditionalProperties = (node: ts.ClassDeclaration, context: Configuration): ts.ClassDeclaration => {
    const contextName = ConfigLoader.get().features.keepContextNames && context.name ?
        factory.createStringLiteral(context.name)
        : factory.createIdentifier('undefined');
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
                factory.createStringLiteral(RuntimeElement.METADATA),
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
                                    factory.createPropertyAssignment(
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

const getLifecycleConfigProperty = (context: Configuration): ts.ObjectLiteralExpression => {
    const lifecycleBeanData: Record<LifecycleKind, string[]> = {
        [LifecycleKind.POST_CONSTRUCT]: [],
        [LifecycleKind.BEFORE_DESTRUCT]: [],
    };

    context.beanRegister.elements.forEach(bean => {
        if (bean.isLifecycle()) {
            bean.lifecycle?.forEach(lifecycle => {
                lifecycleBeanData[lifecycle].push(bean.classMemberName);
            });
        }
    });

    const propertyAssignments = Object.entries(lifecycleBeanData)
        .map(([lifecycle, methodNames]) => {
            return factory.createPropertyAssignment(
                factory.createStringLiteral(lifecycle),
                factory.createArrayLiteralExpression(
                    methodNames.map(it => factory.createStringLiteral(it)),
                    false
                )
            );
        });

    return factory.createObjectLiteralExpression(
        propertyAssignments,
        false,
    );
};
