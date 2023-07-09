import ts, { factory } from 'typescript';
import { Configuration } from '../../../configuration/Configuration';
import { InternalElementKind, InternalsAccessBuilder } from '../../../internals-access/InternalsAccessBuilder';
import { FactoryElementType } from '../../../../../runtime/internal/InternalApplicationFactory';

export const getStaticInitBlock = (configuration: Configuration): ts.ClassStaticBlockDeclaration => {
  const configurationFactoryElement = buildFactoryElement(
    FactoryElementType.CONFIGURATION,
    configuration.runtimeId,
    null,
    true,
  );
  const autowireds = Array.from(configuration.autowiredRegister.elements).map(it => {
    return buildFactoryElement(
      FactoryElementType.AUTOWIRED,
      it.runtimeId,
      configuration.autowiredRegister.parent.runtimeId,
      false,
    );
  });
  const beans = Array.from(configuration.beanRegister.elements).map(it => {
    return buildFactoryElement(
      FactoryElementType.BEAN,
      it.runtimeId,
      configuration.beanRegister.parent.runtimeId,
      false,
    );
  });

  const bodyStatement = factory.createExpressionStatement(factory.createCallExpression(
    factory.createPropertyAccessExpression(
      InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.InternalApplicationFactory),
      factory.createIdentifier('registerFactoryElements')
    ),
    undefined,
    [configurationFactoryElement, ...autowireds, ...beans]
  ));

  return factory.createClassStaticBlockDeclaration(factory.createBlock(
    [bodyStatement],
    true
  ));
};

function buildFactoryElement(type: FactoryElementType, id: string, parentId: string | null, classConstructor: boolean): ts.ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        factory.createIdentifier('id'),
        factory.createStringLiteral(id)
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier('type'),
        factory.createNumericLiteral(type),
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier('parentId'),
        parentId ? factory.createStringLiteral(parentId) : factory.createNull()
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier('classConstructor'),
        classConstructor ? factory.createThis() : factory.createNull()
      ),
    ],
    false
  );
}
