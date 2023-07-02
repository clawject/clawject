import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../ts/utils/getNodeSourceDescriptor';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { ConfigLoader } from '../../config/ConfigLoader';
import { DIType } from '../type-system/DIType';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getBeanLazyExpression } from '../ts/bean-info/getBeanLazyExpression';
import { getBeanScopeExpression } from '../ts/bean-info/getBeanScopeExpression';

export const registerPropertyBean = (
    configuration: Configuration,
    classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
    const compilationContext = getCompilationContext();

    const firstArgument = unwrapExpressionFromRoundBrackets(classElement.initializer).arguments[0];
    const nodeSourceDescriptors = getNodeSourceDescriptor(firstArgument);

    if (nodeSourceDescriptors === null) {
        compilationContext.report(new DependencyResolvingError(
            'Try to use method bean instead.',
            firstArgument,
            configuration.node,
        ));
        return;
    }

    const classDeclarations = nodeSourceDescriptors.filter(it => ts.isClassDeclaration(it.originalNode));

    if (classDeclarations.length === 0) {
        compilationContext.report(new DependencyResolvingError(
            'Can not resolve class declaration, try to use method bean instead.',
            firstArgument,
            configuration.node,
        ));
        return;
    }

    if (classDeclarations.length > 1) {
        compilationContext.report(new DependencyResolvingError(
            `Found ${classDeclarations.length} class declarations, try to use method bean instead.`,
            firstArgument,
            configuration.node,
        ));
        return;
    }

    const typeChecker = compilationContext.typeChecker;

    const classDeclaration = classDeclarations[0].originalNode as ts.ClassDeclaration;
    const baseType = typeChecker.getTypeAtLocation(classElement);

    let diType: DIType;

    if (ConfigLoader.get().features.advancedTypeInference) {
        const heritageClausesMembers = classDeclaration.heritageClauses?.map(it => it.types).flat() ?? [];

        const implementsClauseTypes = heritageClausesMembers.map(it => typeChecker.getTypeAtLocation(it.expression));

        diType = DITypeBuilder.buildSyntheticIntersection(
            [baseType, ...implementsClauseTypes],
        );
    } else {
        diType = DITypeBuilder.build(baseType);
    }

    const contextBean = new Bean({
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.PROPERTY,
        classDeclaration: classDeclaration,
    });
    contextBean.lazyExpression.node = getBeanLazyExpression(contextBean);
    contextBean.scopeExpression.node = getBeanScopeExpression(contextBean);
    configuration.beanRegister.register(contextBean);
};
