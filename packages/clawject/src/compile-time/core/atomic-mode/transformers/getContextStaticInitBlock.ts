import ts, { factory } from 'typescript';
import { getBeanConfigObjectLiteral } from './getBeanConfigObjectLiteral';
import { Configuration } from '../../configuration/Configuration';
import { ConfigLoader } from '../../../config/ConfigLoader';
import { LifecycleKind } from '../../component-lifecycle/LifecycleKind';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { getBeanFactoriesPropertyAssignment } from './getBeanFactoriesPropertyAssignment';

export const getContextStaticInitBlock = (node: ts.ClassDeclaration, configuration: Configuration): ts.ClassStaticBlockDeclaration => {
  const contextName = ConfigLoader.get().features.keepContextNames && configuration.className ?
    factory.createStringLiteral(configuration.className)
    : factory.createIdentifier('undefined');
  const lifecycleConfigProperty = getLifecycleConfigProperty(configuration);
  const beanConfigProperty = getBeanConfigObjectLiteral(configuration);
  const contextBuilderExpression = getContextBuilderExpression(configuration);

  const runtimeContextMetadata = factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        factory.createIdentifier('contextName'),
        contextName
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
        factory.createIdentifier('scope'),
        configuration.scopeExpression.getAndDispose()
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier('contextBuilder'),
        contextBuilderExpression,
      )
    ],
    true
  );


  return factory.createClassStaticBlockDeclaration(factory.createBlock(
    [factory.createExpressionStatement(factory.createCallExpression(
      factory.createPropertyAccessExpression(
        InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.Utils),
        factory.createIdentifier('defineContextMetadata')
      ),
      undefined,
      [
        factory.createThis(),
        runtimeContextMetadata
      ]
    ))],
    true
  ));
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
