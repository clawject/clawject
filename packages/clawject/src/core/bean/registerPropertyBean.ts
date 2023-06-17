import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { getPropertyBeanInfo } from '../ts/bean-info/getPropertyBeanInfo';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { ContextBean } from './ContextBean';
import { BeanKind } from './BeanKind';
import { Context } from '../context/Context';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../ts/utils/getNodeSourceDescriptor';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { ConfigLoader } from '../../config/ConfigLoader';
import { DIType } from '../type-system/DIType';

export const registerPropertyBean = (
    compilationContext: CompilationContext,
    context: Context,
    classElement: ClassPropertyWithCallExpressionInitializer,
): void => {
    const beanInfo = getPropertyBeanInfo(compilationContext, context, classElement);

    const firstArgument = unwrapExpressionFromRoundBrackets(classElement.initializer).arguments[0];
    const nodeSourceDescriptors = getNodeSourceDescriptor(firstArgument, compilationContext);

    if (nodeSourceDescriptors === null) {
        compilationContext.report(new DependencyResolvingError(
            'Try to use method bean instead.',
            firstArgument,
            context.node,
        ));
        return;
    }

    const classDeclarations = nodeSourceDescriptors.filter(it => ts.isClassDeclaration(it.originalNode));

    if (classDeclarations.length === 0) {
        compilationContext.report(new DependencyResolvingError(
            'Can not resolve class declaration, try to use method bean instead.',
            firstArgument,
            context.node,
        ));
        return;
    }

    if (classDeclarations.length > 1) {
        compilationContext.report(new DependencyResolvingError(
            `Found ${classDeclarations.length} class declarations, try to use method bean instead.`,
            firstArgument,
            context.node,
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
            compilationContext,
        );
    } else {
        diType = DITypeBuilder.build(baseType, compilationContext);
    }

    const contextBean = new ContextBean({
        context: context,
        classMemberName: classElement.name.getText(),
        diType: diType,
        node: classElement,
        kind: BeanKind.PROPERTY,
        scope: beanInfo.scope,
        classDeclaration: classDeclaration,
    });
    context.registerBean(contextBean);
};
