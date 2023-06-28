import { Configuration } from '../configuration/Configuration';
import { DependencyGraph } from './DependencyGraph';
import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../transformer/getCompilationContext';
import { MissingBeanDeclarationError } from '../../compilation-context/messages/errors/MissingBeanDeclarationError';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';

export const buildDependencyGraphAndFillQualifiedBeans = (context: Configuration) => {
    const contextBeans = context.beanRegister.elements;

    contextBeans.forEach(bean => {
        const allBeansWithoutCurrent = new Set(contextBeans);
        allBeansWithoutCurrent.delete(bean);

        bean.dependencies.forEach(dependency => {
            if (dependency.diType.isVoidUndefinedPlainUnionIntersection || dependency.diType.isNull) {
                return;
            }

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
    dependency: Dependency,
    context: Configuration,
): void {
    const compilationContext = getCompilationContext();
    const allBeansWithoutCurrentArray = Array.from(allBeansWithoutCurrent);
    const matchedByType = allBeansWithoutCurrentArray
        .filter(it => dependency.diType.isCompatible(it.diType));

    if (matchedByType.length === 1) {
        dependency.qualifiedBean = matchedByType[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByType);
        return;
    }

    if (matchedByType.length === 0) {
        const [
            byName,
            byType,
        ] = getPossibleBeanCandidates(dependency.parameterName, dependency.diType, allBeansWithoutCurrentArray);

        compilationContext.report(new MissingBeanDeclarationError(
            'Can not find suitable Bean candidate for parameter.',
            dependency.node,
            context.node,
            byName,
            byType,
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

    const [
        byName,
        byType,
    ] = getPossibleBeanCandidates(dependency.parameterName, dependency.diType, allBeansWithoutCurrentArray);

    compilationContext.report(new MissingBeanDeclarationError(
        `Found ${matchedByType.length} candidates for parameter "${dependency.parameterName}". Rename parameter to match Bean name, to specify which Bean should be injected.`,
        dependency.node,
        context.node,
        byName,
        byType,
    ));
    return;
}

function buildForCollectionOrArray(
    bean: Bean,
    allBeansWithoutCurrent: Set<Bean>,
    dependency: Dependency,
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
