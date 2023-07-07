import ts, { factory } from 'typescript';
import { Component } from '../../component/Component';
import { LifecycleKind } from '../../component-lifecycle/LifecycleKind';
import { StaticRuntimeElement } from '../../../../runtime/runtime-elements/StaticRuntimeElement';

export const getImplicitComponentStaticInitBlock = (component: Component): ts.ClassStaticBlockDeclaration => {
    return factory.createClassStaticBlockDeclaration(factory.createBlock(
        [factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
                factory.createIdentifier('Object'),
                factory.createIdentifier('defineProperty')
            ),
            undefined,
            [
                factory.createThis(),
                factory.createStringLiteral(StaticRuntimeElement.COMPONENT_METADATA),
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
                                [
                                    factory.createPropertyAssignment(
                                        factory.createIdentifier('lifecycle'),
                                        getLifecycleConfigProperty(component)
                                    )
                                ],
                                true
                            ))
                        )
                    )],
                    true
                )
            ]
        ))],
        true
    ));
};

const getLifecycleConfigProperty = (component: Component): ts.ObjectLiteralExpression => {
    const lifecycleToClassElementNames: Record<LifecycleKind, string[]> = {
        [LifecycleKind.POST_CONSTRUCT]: [],
        [LifecycleKind.PRE_DESTROY]: [],
    };

    component.componentLifecycleRegister.elements.forEach(componentLifecycle => {
        componentLifecycle.lifecycles.forEach(lifecycle => {
            lifecycleToClassElementNames[lifecycle].push(componentLifecycle.classMemberName);
        });
    });

    const propertyAssignments = Object.entries(lifecycleToClassElementNames)
        .map(([lifecycle, methodNames]) => {
            return factory.createPropertyAssignment(
                factory.createStringLiteral(lifecycle),
                factory.createArrayLiteralExpression(
                    methodNames.map(it => factory.createStringLiteral(it)),
                    true
                )
            );
        });

    return factory.createObjectLiteralExpression(
        propertyAssignments,
        true,
    );
};
