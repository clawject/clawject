import { IncorrectTypeDefinitionError } from '../../compilation-context/messages/errors/IncorrectTypeDefinitionError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from './Bean';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import ts from 'typescript';
import { isPropertyWithArrowFunction } from '../ts/predicates/isPropertyWithArrowFunction';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { BeanKind } from './BeanKind';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';

export const fillEmbeddedBeans = (
  configuration: Configuration,
): void => {
  configuration.beanRegister.elements.forEach((rootBean) => {
    const compilationContext = getCompilationContext();
    const embeddedDecorator = extractDecoratorMetadata(rootBean.node, DecoratorKind.Embedded);

    if (embeddedDecorator === null) {
      return;
    }

    if (rootBean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      compilationContext.report(new NotSupportedError(
        '@Embedded decorator is not supported for class constructor beans.',
        rootBean.node,
        configuration.node,
      ));
      return;
    }

    const typeChecker = compilationContext.typeChecker;
    const rootBeanNode = rootBean.node;
    let type: ts.Type | undefined = undefined;

    if (ts.isMethodDeclaration(rootBeanNode)) {
      const signature = typeChecker.getSignatureFromDeclaration(rootBeanNode);
      signature && (type = typeChecker.getReturnTypeOfSignature(signature));
    } else if (isPropertyWithArrowFunction(rootBeanNode)) {
      const signature = typeChecker.getSignatureFromDeclaration(
        unwrapExpressionFromRoundBrackets((rootBean as Bean<ClassPropertyWithArrowFunctionInitializer>).node.initializer)
      );
      signature && (type = typeChecker.getReturnTypeOfSignature(signature));
    } else {
      type = typeChecker.getTypeAtLocation(rootBeanNode);
    }

    const typeSymbol = type?.getSymbol();

    if (!typeSymbol) {
      compilationContext.report(new TypeQualifyError(
        'Could not resolve type, try specify type explicitly.',
        rootBean.node,
        configuration.node,
      ));
      return;
    }

    const declarations = typeSymbol.declarations ?? [];

    if (declarations.length === 0) {
      compilationContext.report(new TypeQualifyError(
        'Could not resolve type, try specify type explicitly.',
        rootBean.node,
        configuration.node,
      ));
      return;
    }

    if (declarations.length > 1) {
      compilationContext.report(new IncorrectTypeDefinitionError(
        'Found more than 1 type declarations of Embedded Bean, type should be defined only once.',
        rootBean.node.type ?? rootBean.node,
        configuration.node,
      ));
      return;
    }

    const declaration = declarations[0];
    const declarationType = typeChecker.getTypeAtLocation(declaration);
    declarationType.getProperties().forEach(property => {
      const type = typeChecker.getTypeOfSymbolAtLocation(property, declaration);
      const diType = DITypeBuilder.buildForClassBean(type) ?? DITypeBuilder.build(type);

      rootBean.embeddedElements.set(property.name, diType);
    });
  });
};
