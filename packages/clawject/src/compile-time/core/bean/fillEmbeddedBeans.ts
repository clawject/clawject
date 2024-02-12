import { Bean } from './Bean';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import ts from 'typescript';
import { BeanKind } from './BeanKind';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { DIType } from '../type-system/DIType';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const fillEmbeddedBeans = (
  configuration: Configuration,
): void => {
  // Needed because we're modifying an original collection
  const beans = Array.from(configuration.beanRegister.elements);

  beans.forEach((rootBean) => {
    const compilationContext = getCompilationContext();
    const embeddedDecorator = extractDecoratorMetadata(rootBean.node, DecoratorKind.Embedded);

    if (embeddedDecorator === null) {
      return;
    }

    if (rootBean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      compilationContext.report(new NotSupportedError(
        '@Embedded decorator is not allowed for class constructor beans.',
        rootBean.node,
        configuration,
      ));
      return;
    }

    const typeChecker = compilationContext.typeChecker;
    const rootBeanNode = rootBean.node;
    let type: ts.Type | null = typeChecker.getTypeAtLocation(rootBeanNode);

    if (rootBean.kind === BeanKind.FACTORY_METHOD || rootBean.kind === BeanKind.FACTORY_ARROW_FUNCTION) {
      const callSignatures = typeChecker.getTypeAtLocation(rootBeanNode).getCallSignatures();

      if (callSignatures.length !== 1) {
        compilationContext.report(new TypeQualifyError(
          `Could not resolve bean function signature. Bean must have exactly one call signature, found ${callSignatures.length} signatures.`,
          rootBeanNode,
          configuration,
        ));
        return;
      }
      const callSignature = callSignatures[0];
      type = typeChecker.getReturnTypeOfSignature(callSignature);
    }

    if (type) {
      type = DITypeBuilder.getAwaitedType(type);
    }

    const typeSymbol = type?.getSymbol();

    if (!typeSymbol) {
      compilationContext.report(new TypeQualifyError(
        'Could not resolve type, try specify type explicitly.',
        rootBean.node,
        configuration,
      ));
      return;
    }

    const declarations = typeSymbol.declarations ?? [];

    if (declarations.length === 0) {
      compilationContext.report(new TypeQualifyError(
        'Could not resolve type, try specify type explicitly.',
        rootBean.node,
        configuration,
      ));
      return;
    }

    const declarationsTypes = declarations.reduce((acc, declaration) => {
      const declarationType = typeChecker.getTypeAtLocation(declaration);
      declarationType.getProperties().forEach(property => {
        const propertyTypes = acc.get(property.name) ?? [];
        !acc.has(property.name) && acc.set(property.name, propertyTypes);
        const type = typeChecker.getTypeOfSymbolAtLocation(property, declaration);

        propertyTypes.push(DITypeBuilder.build(type));
      });

      return acc;
    }, new Map<string, DIType[]>());

    declarationsTypes.forEach((types, name) => {
      const intersectionType = DITypeBuilder.buildSyntheticIntersectionOrPlain(types);

      const bean = new Bean({
        classMemberName: rootBean.classMemberName,
        parentConfiguration: configuration,
        node: rootBean.node,
        kind: rootBean.kind,
        nestedProperty: name,
        external: rootBean.external,
        primary: rootBean.primary,
      });
      bean.registerType(intersectionType);
      configuration.beanRegister.register(bean);
    });
  });
};
