import ts, { factory } from 'typescript';
import { InternalElementKind, InternalsAccessBuilder } from '../../../internals-access/InternalsAccessBuilder';

export function getConfigurationStaticInitBlock(): ts.ClassElement {
  const internalPropertyAccessExpression = InternalsAccessBuilder
    .internalPropertyAccessExpression(InternalElementKind.ApplicationManager);

  return factory.createClassStaticBlockDeclaration(factory.createBlock(
    [factory.createExpressionStatement(factory.createCallExpression(
      factory.createPropertyAccessExpression(
        internalPropertyAccessExpression,
        factory.createIdentifier('registerConfiguration')
      ),
      undefined,
      [
        factory.createThis(),
        factory.createArrowFunction(
          undefined,
          undefined,
          [],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createThis()
        )
      ]
    ))],
    true
  ));
}
