import ts from 'typescript';
import { IncorrectTypeDefinitionError } from '../../compilation-context/messages/errors/IncorrectTypeDefinitionError';
import { MissingBeanDeclarationError } from '../../compilation-context/messages/errors/MissingBeanDeclarationError';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { getCompilationContext } from '../../transformers/getCompilationContext';
import { nameMatcher } from '../utils/nameMatcher';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';

export const checkIsAllBeansRegisteredInContextAndFillBeanRequierness = (context: Configuration): void => {
    const compilationContext = getCompilationContext();
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
    const diType = DITypeBuilder.build(type);

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
    const contextBeans = Array.from(context.beanRegister.elements);
    const beans = contextBeans
        .reduce((acc, curr) => {
            acc.set(curr.classMemberName, curr);
            return acc;
        }, new Map<string, Bean>());

    typeProperties.forEach((property) => {
        const propertyName = property.getName();
        const propertyType = typeChecker.getTypeOfSymbolAtLocation(property, typeNode);
        const propertyDIType = DITypeBuilder.build(propertyType);
        const bean = beans.get(propertyName);

        if (!bean) {
            const [
                byName,
                byType,
            ] = getPossibleBeanCandidates(propertyName, propertyDIType, contextBeans);

            compilationContext.report(new MissingBeanDeclarationError(
                null,
                property.valueDeclaration ?? typeNode,
                context.node,
                byName,
                byType,
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
