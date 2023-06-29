import ts, { factory } from 'typescript';
import { Component } from '../../component/Component';
import { RuntimeElement } from '../../runtime-element/RuntimeElement';
import { LifecycleKind } from '../../component-lifecycle/LifecycleKind';

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
                                [
                                    factory.createPropertyAssignment(
                                        factory.createIdentifier('lifecycleConfiguration'),
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
        [LifecycleKind.BEFORE_DESTRUCT]: [],
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
                    false
                )
            );
        });

    return factory.createObjectLiteralExpression(
        propertyAssignments,
        false,
    );
};
