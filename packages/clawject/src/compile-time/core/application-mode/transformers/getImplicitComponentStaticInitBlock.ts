import ts, { factory } from 'typescript';
import { Component } from '../../component/Component';
import { LifecycleKind } from '../../../../runtime/types/LifecycleKind';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { addDoNotEditComment, DoNotEditElement } from './addDoNotEditComment';

export const getImplicitComponentStaticInitBlock = (component: Component): ts.ClassStaticBlockDeclaration => {
  const block = factory.createClassStaticBlockDeclaration(factory.createBlock(
    [
      factory.createExpressionStatement(factory.createCallExpression(
        factory.createPropertyAccessExpression(
          InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
          factory.createIdentifier('defineComponentMetadata')
        ),
        undefined,
        [
          factory.createThis(),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier('lifecycle'),
                getLifecycleConfigProperty(component)
              )
            ],
            true
          ),
        ]
      ))
    ],
    true
  ));

  return addDoNotEditComment(block, DoNotEditElement.STATIC_INIT_BLOCK);
};

const getLifecycleConfigProperty = (component: Component): ts.ObjectLiteralExpression => {
  const lifecycleToClassElementNames: Record<LifecycleKind, string[]> = {
    [LifecycleKind.POST_CONSTRUCT]: [],
    [LifecycleKind.PRE_DESTROY]: [],
  };

  component.lifecycleRegister.elements.forEach(componentLifecycle => {
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
