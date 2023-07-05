import { IncorrectTypeDefinitionError } from '../../compilation-context/messages/errors/IncorrectTypeDefinitionError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const fillEmbeddedBeans = (
    configuration: Configuration,
): void => {
    configuration.beanRegister.elements.forEach((rootBean) => {
        const embeddedDecorator = extractDecoratorMetadata(rootBean.node, DecoratorKind.Embedded);

        if (embeddedDecorator === null) {
            return;
        }

        const compilationContext = getCompilationContext();
        const typeChecker = compilationContext.typeChecker;
        const type = typeChecker.getTypeAtLocation(rootBean.node);
        const typeSymbol = type.getSymbol();

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
            const diType = DITypeBuilder.build(type);

            const nestedBean = new Bean({
                classMemberName: rootBean.node.name.getText(),
                nestedProperty: property.name,
                diType: diType,
                node: rootBean.node,
                kind: BeanKind.EMBEDDED,
            });
            rootBean.nestedBeans.add(nestedBean);
        });
    });
};
