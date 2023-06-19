import { Configuration } from '../configuration/Configuration';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { DependencyGraph } from './DependencyGraph';
import { BeanDependency } from '../bean-dependency/BeanDependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../transformers/getCompilationContext';

export const buildDependencyGraphAndFillQualifiedBeans = (context: Configuration) => {
    const contextBeans = context.beanRegister.elements;

    contextBeans.forEach(bean => {
        const allBeansWithoutCurrent = new Set(contextBeans);
        allBeansWithoutCurrent.delete(bean);

        bean.dependencies.forEach(dependency => {
            if (dependency.diType.isArray || dependency.diType.isSet || dependency.diType.isMapStringToAny) {
                buildForCollectionOrArray(bean, allBeansWithoutCurrent, dependency);
            } else {
                buildForBaseType(bean, allBeansWithoutCurrent, dependency, context);
            }
        });
    });
};

function buildForBaseType(
    bean: Bean,
    allBeansWithoutCurrent: Set<Bean>,
    dependency: BeanDependency,
    context: Configuration,
): void {
    const compilationContext = getCompilationContext();
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
    bean: Bean,
    allBeansWithoutCurrent: Set<Bean>,
    dependency: BeanDependency,
): void {
    let matched: Bean[];

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
