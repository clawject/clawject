import { CompilationContext } from '../../compilation-context/CompilationContext';
import { Context } from '../context/Context';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { DependencyGraph } from './DependencyGraph';
import { BeanDependency } from '../bean-dependency/BeanDependency';
import { ContextBean } from '../bean/ContextBean';

export const buildDependencyGraphAndFillQualifiedBeans = (
    compilationContext: CompilationContext,
    context: Context
) => {
    const contextBeans = context.beans;

    contextBeans.forEach(bean => {
        const allBeansWithoutCurrent = new Set(contextBeans);
        allBeansWithoutCurrent.delete(bean);

        bean.dependencies.forEach(dependency => {
            if (dependency.diType.isArray || dependency.diType.isSet || dependency.diType.isMapStringToAny) {
                buildForCollectionOrArray(bean, allBeansWithoutCurrent, dependency);
            } else {
                buildForBaseType(bean, allBeansWithoutCurrent, dependency, context, compilationContext);
            }
        });
    });
};

function buildForBaseType(
    bean: ContextBean,
    allBeansWithoutCurrent: Set<ContextBean>,
    dependency: BeanDependency,
    context: Context,
    compilationContext: CompilationContext
): void {
    const matchedByType = Array.from(allBeansWithoutCurrent)
        .filter(it => dependency.diType.isCompatible(it.diType));

    if (matchedByType.length === 1) {
        dependency.qualifiedBean = matchedByType[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByType);
        return;
    }

    if (matchedByType.length === 0) {
        compilationContext.report(new DependencyResolvingError(
            'Can not find Bean candidate for parameter.',
            dependency.node,
            context.node,
        ));
        return;
    }

    const matchedByName = matchedByType
        .filter(it => dependency.parameterName === it.classMemberName);

    if (matchedByName.length === 1) {
        dependency.qualifiedBean = matchedByName[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByType);
        return;
    }

    const matchedByNotNested = matchedByType.filter(it => it.nestedProperty === null);

    if (matchedByNotNested.length === 1) {
        dependency.qualifiedBean = matchedByNotNested[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByNotNested);
        return;
    }

    compilationContext.report(new DependencyResolvingError(
        `Found ${matchedByType.length} candidates for parameter "${dependency.parameterName}". Rename parameter to match Bean name, to specify which Bean should be injected.`,
        dependency.node,
        context.node,
    ));
    return;
}

function buildForCollectionOrArray(
    bean: ContextBean,
    allBeansWithoutCurrent: Set<ContextBean>,
    dependency: BeanDependency,
): void {
    let matched: ContextBean[];

    if (dependency.diType.isMapStringToAny) {
        matched = Array.from(allBeansWithoutCurrent)
            .filter(it => dependency.diType.typeArguments[1].isCompatible(it.diType));
    } else {
        matched = Array.from(allBeansWithoutCurrent)
            .filter(it => dependency.diType.typeArguments[0].isCompatible(it.diType));
    }

    dependency.qualifiedBeans = matched;
    DependencyGraph.addNodeWithEdges(bean, matched);
}
