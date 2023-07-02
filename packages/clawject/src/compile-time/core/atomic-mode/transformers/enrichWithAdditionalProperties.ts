import ts, { factory } from 'typescript';
import { getBeanConfigObjectLiteral } from './getBeanConfigObjectLiteral';
import { Configuration } from '../../configuration/Configuration';
import { ConfigLoader } from '../../../config/ConfigLoader';
import { LifecycleKind } from '../../component-lifecycle/LifecycleKind';
import { RuntimeElement } from '../../../../runtime/runtime-elements/RuntimeElement';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';

export const enrichWithAdditionalProperties = (node: ts.ClassDeclaration, context: Configuration): ts.ClassDeclaration => {
    const contextName = ConfigLoader.get().features.keepContextNames && context.name ?
        factory.createStringLiteral(context.name)
        : factory.createIdentifier('undefined');
    const lifecycleConfigProperty = getLifecycleConfigProperty(context);
    const beanConfigProperty = getBeanConfigObjectLiteral(context);

    const staticInitBlock = factory.createClassStaticBlockDeclaration(factory.createBlock(
        [factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
                factory.createIdentifier('Object'),
                factory.createIdentifier('defineProperty')
            ),
            undefined,
            [
                factory.createThis(),
                factory.createStringLiteral(RuntimeElement.CONTEXT_MANAGER),
                factory.createObjectLiteralExpression(
                    [
                        factory.createPropertyAssignment(
                            factory.createIdentifier('value'),
                            factory.createNewExpression(
                                InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ContextManager),
                                undefined,
                                [factory.createObjectLiteralExpression(
                                    [
                                        factory.createPropertyAssignment(
                                            factory.createIdentifier('id'),
                                            factory.createStringLiteral(context.runtimeId)
                                        ),
                                        factory.createPropertyAssignment(
                                            factory.createIdentifier('contextName'),
                                            contextName
                                        ),
                                        factory.createPropertyAssignment(
                                            factory.createIdentifier('contextConstructor'),
                                            factory.createThis()
                                        ),
                                        factory.createPropertyAssignment(
                                            factory.createIdentifier('lifecycle'),
                                            lifecycleConfigProperty
                                        ),
                                        factory.createPropertyAssignment(
                                            factory.createIdentifier('beans'),
                                            beanConfigProperty
                                        )
                                    ],
                                    true
                                )]
                            )
                        ),
                        factory.createPropertyAssignment(
                            factory.createIdentifier('configurable'),
                            factory.createFalse()
                        ),
                        factory.createPropertyAssignment(
                            factory.createIdentifier('enumerable'),
                            factory.createFalse()
                        ),
                        factory.createPropertyAssignment(
                            factory.createIdentifier('writable'),
                            factory.createFalse()
                        )
                    ],
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
            ...node.members,
            staticInitBlock,
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
