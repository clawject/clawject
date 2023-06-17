import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { MissingTypeDefinitionError } from '../../compilation-context/messages/errors/MissingTypeDefinitionError';
import { IncorrectTypeDefinitionError } from '../../compilation-context/messages/errors/IncorrectTypeDefinitionError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ContextBean } from './ContextBean';
import { BeanKind } from './BeanKind';
import { Context } from '../context/Context';

export const registerEmbeddedBean = (
    compilationContext: CompilationContext,
    context: Context,
    classElement: ts.PropertyDeclaration
): void => {
    const typeChecker = compilationContext.typeChecker;
    const type = typeChecker.getTypeAtLocation(classElement);
    const diTypeRoot = DITypeBuilder.build(type, compilationContext);
    const typeSymbol = type.getSymbol();

    if (!typeSymbol) {
        //TODO add error
        compilationContext.report(new MissingTypeDefinitionError(
            null,
            classElement,
            context.node,
        ));
        return;
    }

    const declarations = typeSymbol.declarations ?? [];

    if (declarations.length === 0) {
        compilationContext.report(new MissingTypeDefinitionError(
            //TODO add error
            null,
            classElement,
            context.node,
        ));
        return;
    }

    if (declarations.length > 1) {
        compilationContext.report(new IncorrectTypeDefinitionError(
            //TODO add found declarations
            'Type of Embedded bean should be defined only once.',
            classElement.type ?? classElement,
            context.node,
        ));
        return;
    }

    const declaration = declarations[0];
    const declarationType = typeChecker.getTypeAtLocation(declaration);
    declarationType.getProperties().forEach(property => {
        const type = typeChecker.getTypeOfSymbolAtLocation(property, declaration);
        const diType = DITypeBuilder.build(type, compilationContext);

        const contextBean = new ContextBean({
            context: context,
            classMemberName: classElement.name.getText(),
            nestedProperty: property.name,
            diType: diType,
            node: classElement,
            kind: BeanKind.EMBEDDED,
        });
        context.registerBean(contextBean);
    });

    const rootContextBean = new ContextBean({
        context: context,
        classMemberName: classElement.name.getText(),
        diType: diTypeRoot,
        node: classElement,
        kind: BeanKind.EMBEDDED,
    });
    context.registerBean(rootContextBean);
};
