import { Bean } from './Bean';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { BeanKind } from './BeanKind';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { CType } from '../type-system/CType';

export const fillEmbeddedBeans = (
  configuration: Configuration,
): void => {
  // Needed because we're modifying an original collection
  const beans = new Set(configuration.beanRegister.elements);

  beans.forEach((embeddedParent) => {
    const compilationContext = getCompilationContext();
    const embeddedDecorator = extractDecoratorMetadata(embeddedParent.node, DecoratorKind.Embedded);

    if (embeddedDecorator === null) {
      return;
    }

    if (embeddedParent.kind === BeanKind.CLASS_CONSTRUCTOR) {
      compilationContext.report(new NotSupportedError(
        '@Embedded decorator is not allowed for class constructor beans.',
        embeddedParent.node,
        configuration,
        null,
      ));
      return;
    }

    const typeChecker = compilationContext.typeChecker;
    const rootBeanNode = embeddedParent.node;
    let type = typeChecker.getTypeAtLocation(rootBeanNode);

    if (embeddedParent.kind === BeanKind.FACTORY_METHOD || embeddedParent.kind === BeanKind.FACTORY_ARROW_FUNCTION) {
      const callSignatures = typeChecker.getTypeAtLocation(rootBeanNode).getCallSignatures();

      if (callSignatures.length !== 1) {
        compilationContext.report(new TypeQualifyError(
          `Could not resolve bean factory signature. Bean must have exactly one 1 signature, found ${callSignatures.length} signatures.`,
          rootBeanNode,
          configuration,
          null,
        ));
        return;
      }
      const callSignature = callSignatures[0];
      type = typeChecker.getReturnTypeOfSignature(callSignature);
    }

    if (type) {
      const cType = new CType(type);
      type = cType.getPromisedType()?.tsType ?? cType.tsType;
    }

    const typeProperties = type.getProperties();

    typeProperties.forEach(propertySymbol => {
      const bean = new Bean({
        classMemberName: embeddedParent.classMemberName,
        parentConfiguration: configuration,
        node: embeddedParent.node,
        kind: embeddedParent.kind,
        nestedProperty: propertySymbol.name,
        external: embeddedParent.external,
        primary: embeddedParent.primary,
        embeddedParent: embeddedParent,
      });
      bean.registerType(new CType(typeChecker.getTypeOfSymbol(propertySymbol)));
      configuration.beanRegister.register(bean);
    });
  });
};
