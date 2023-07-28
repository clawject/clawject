import ts, { factory } from 'typescript';
import { getBeanConfigObjectLiteral } from './getBeanConfigObjectLiteral';
import { Configuration } from '../../configuration/Configuration';
import { ConfigLoader } from '../../../config/ConfigLoader';
import { LifecycleKind } from '../../component-lifecycle/LifecycleKind';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { getBeanFactoriesPropertyAssignment } from './getBeanFactoriesPropertyAssignment';
import { StaticRuntimeElement } from '../../../../runtime/runtime-elements/StaticRuntimeElement';

export const enrichWithAdditionalProperties = (node: ts.ClassDeclaration, configuration: Configuration): ts.ClassDeclaration => {
  const contextName = ConfigLoader.get().features.keepContextNames && configuration.name ?
    factory.createStringLiteral(configuration.name)
    : factory.createIdentifier('undefined');
  const lifecycleConfigProperty = getLifecycleConfigProperty(configuration);
  const beanConfigProperty = getBeanConfigObjectLiteral(configuration);
  const contextBuilderExpression = getContextBuilderExpression(configuration);

  const contextManagerConfig = factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        factory.createIdentifier('id'),
        factory.createStringLiteral(configuration.runtimeId)
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
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier('lazy'),
        configuration.lazyExpression.getAndDispose()
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier('contextBuilder'),
        contextBuilderExpression,
      )
    ],
    true
  );


  const staticInitBlock = factory.createClassStaticBlockDeclaration(factory.createBlock(
    [factory.createExpressionStatement(factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.Utils),
        factory.createIdentifier('defineProperty')
      ),
      undefined,
      [
        factory.createThis(),
        factory.createStringLiteral(StaticRuntimeElement.CONTEXT_METADATA),
        contextManagerConfig
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
    [LifecycleKind.PRE_DESTROY]: [],
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
          true
        )
      );
    });

  return factory.createObjectLiteralExpression(
    propertyAssignments,
    true,
  );
};

function getContextBuilderExpression(configuration: Configuration): ts.Expression {
  const beanFactoriesPropertyAssignment = getBeanFactoriesPropertyAssignment(configuration);

  return factory.createArrowFunction(
    undefined,
    undefined,
    [],
    undefined,
    factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    factory.createBlock(
      [
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [factory.createVariableDeclaration(
              factory.createIdentifier('instance'),
              undefined,
              undefined,
              factory.createNewExpression(
                factory.createThis(),
                undefined,
                []
              )
            )],
            ts.NodeFlags.Const
          )
        ),
        factory.createReturnStatement(factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('instance'),
              factory.createIdentifier('instance')
            ),
            beanFactoriesPropertyAssignment,
          ],
          true
        ))
      ],
      true
    )
  );
}
