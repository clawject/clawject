import ts, { factory } from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../../ts/types';
import { Bean } from '../../bean/Bean';
import { unwrapExpressionFromRoundBrackets } from '../../ts/utils/unwrapExpressionFromRoundBrackets';
import { isDecoratorFromLibrary } from '../../decorator-processor/isDecoratorFromLibrary';

export const transformBeanClassConstructor = (bean: Bean<ClassPropertyWithCallExpressionInitializer>): ts.PropertyDeclaration => {
  const classExpression = unwrapExpressionFromRoundBrackets(bean.node.initializer).arguments[0];

  return factory.createPropertyDeclaration(
    bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
    factory.createIdentifier(bean.classMemberName),
    undefined,
    undefined,
    factory.createArrowFunction(
      undefined,
      undefined,
      [
        factory.createParameterDeclaration(
          undefined,
          factory.createToken(ts.SyntaxKind.DotDotDotToken),
          factory.createIdentifier('args'),
          undefined,
          factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)),
          undefined
        )
      ],
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      factory.createNewExpression(
        classExpression,
        undefined,
        [factory.createSpreadElement(factory.createIdentifier('args'))],
      ),
    )
  );
};
