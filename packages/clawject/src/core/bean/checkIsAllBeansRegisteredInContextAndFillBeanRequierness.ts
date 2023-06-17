import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { IncorrectTypeDefinitionError } from '../../compilation-context/messages/errors/IncorrectTypeDefinitionError';
import { MissingBeanDeclarationError } from '../../compilation-context/messages/errors/MissingBeanDeclarationError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Context } from '../context/Context';
import { ContextBean } from './ContextBean';

export const checkIsAllBeansRegisteredInContextAndFillBeanRequierness = (
    compilationContext: CompilationContext,
    context: Context
): void => {
    const extendsHeritageClause = context.node.heritageClauses
        ?.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);

    if (!extendsHeritageClause) {
        return;
    }

    const typeArgs = extendsHeritageClause.types[0].typeArguments ?? null;

    if (typeArgs === null || !typeArgs[0]) {
        //If no type args - assuming that all beans are "private"
        return;
    }

    const typeNode = typeArgs[0];

    const typeChecker = compilationContext.typeChecker;
    const type = typeChecker.getTypeAtLocation(typeNode);
    const diType = DITypeBuilder.build(type, compilationContext);

    if (!diType.isObject) {
        compilationContext.report(new IncorrectTypeDefinitionError(
            'Should be an object-like type.',
            typeNode,
            context.node,
        ));
        return;
    }

    context.registerDIType(diType);
    const typeProperties = type.getProperties();
    const beans = Array.from(context.beans)
        .reduce((acc, curr) => {
            acc.set(curr.classMemberName, curr);
            return acc;
        }, new Map<string, ContextBean>());

    typeProperties.forEach((property) => {
        const propertyName = property.getName();
        const propertyType = typeChecker.getTypeOfSymbolAtLocation(property, typeNode);
        const propertyDIType = DITypeBuilder.build(propertyType, compilationContext);
        const bean = beans.get(propertyName);

        if (!bean) {
            //TODO add beans that could be used by type and name
            compilationContext.report(new MissingBeanDeclarationError(
                null,
                property.valueDeclaration ?? typeNode,
                context.node,
            ));
            return;
        }

        if (!propertyDIType.isCompatible(bean.diType)) {
            compilationContext.report(new IncorrectTypeDefinitionError(
                'Type of bean is not compatible with type of property declared in context type argument.',
                bean.node,
                context.node,
            ));
            return;
        }

        bean.public = true;
    });
};
