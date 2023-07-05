import { Configuration } from '../configuration/Configuration';
import { DependencyGraph } from './DependencyGraph';
import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { MissingBeanDeclarationError } from '../../compilation-context/messages/errors/MissingBeanDeclarationError';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';
import { BeanKind } from '../bean/BeanKind';

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
    const allBeansWithNested = Array.from(allBeansWithoutCurrent)
        .map(it => [...Array.from(it.nestedBeans), it]).flat();
    const matchedByType = allBeansWithNested
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
        ] = getPossibleBeanCandidates(dependency.parameterName, dependency.diType, allBeansWithNested);

        if (dependency.diType.isOptional) {
            return;
        }

        compilationContext.report(new MissingBeanDeclarationError(
            'Can not find suitable Bean candidate for parameter.',
            dependency.node,
            context.node,
            byName,
            byType,
        ));
        return;
    }

    //If > 1 trying to find in non-nested beans
    const matchedByTypeNotNested = matchedByType.filter(it => it.kind !== BeanKind.EMBEDDED);

    if (matchedByTypeNotNested.length === 1) {
        dependency.qualifiedBean = matchedByTypeNotNested[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByTypeNotNested);
        return;
    }

    const matchedByNameNotNested = matchedByType
        .filter(it => it.kind !== BeanKind.EMBEDDED && dependency.parameterName === it.classMemberName);

    if (matchedByNameNotNested.length === 1) {
        dependency.qualifiedBean = matchedByNameNotNested[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByType);
        return;
    }

    //If could not find in non-nested beans, trying to find in nested beans, name skipping
    const matchedByTypeNested = matchedByType.filter(it => it.kind === BeanKind.EMBEDDED);

    if (matchedByTypeNested.length === 1) {
        dependency.qualifiedBean = matchedByTypeNested[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByTypeNested);
        return;
    }
    const matchedByNameNested = matchedByTypeNested
        .filter(it => dependency.parameterName === it.nestedProperty);

    if (matchedByNameNested.length === 1) {
        dependency.qualifiedBean = matchedByNameNested[0];
        DependencyGraph.addNodeWithEdges(bean, matchedByNameNested);
        return;
    }

    //If no bean candidates and bean is optional just do nothing
    if (matchedByType.length === 0 && dependency.diType.isOptional) {
        return;
    }

    const [
        byName,
        byType,
    ] = getPossibleBeanCandidates(dependency.parameterName, dependency.diType, allBeansWithNested);

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
    const allBeansWithNested = Array.from(allBeansWithoutCurrent)
        .map(it => [...Array.from(it.nestedBeans), it]).flat();

    const otherCollectionsMatchedByNameAndType = allBeansWithNested.filter(it =>
        it.classMemberName === dependency.parameterName && dependency.diType.isCompatible(it.diType),
    );

    //If matched my name and type - just taking specific bean that returns collection
    if (otherCollectionsMatchedByNameAndType.length === 1) {
        dependency.qualifiedBean = otherCollectionsMatchedByNameAndType[0];
        DependencyGraph.addNodeWithEdges(bean, otherCollectionsMatchedByNameAndType);
        return;
    }

    let matched: Bean[];

    if (dependency.diType.isMapStringToAny) {
        matched = Array.from(allBeansWithNested)
            .filter(it => dependency.diType.typeArguments[1].isCompatible(it.diType));
    } else {
        matched = Array.from(allBeansWithNested)
            .filter(it => dependency.diType.typeArguments[0].isCompatible(it.diType));
    }

    dependency.qualifiedBeans = matched;
    DependencyGraph.addNodeWithEdges(bean, matched);
}
