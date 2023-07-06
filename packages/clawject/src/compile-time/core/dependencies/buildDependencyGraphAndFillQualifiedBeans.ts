import { Configuration } from '../configuration/Configuration';
import { DependencyGraph } from './DependencyGraph';
import { Dependency, DependencyQualifiedBean } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { MissingBeanDeclarationError } from '../../compilation-context/messages/errors/MissingBeanDeclarationError';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';

export const buildDependencyGraphAndFillQualifiedBeans = (context: Configuration) => {
    const contextBeans = context.beanRegister.elements;

    contextBeans.forEach(bean => {
        const allBeansWithoutCurrent = Array.from(contextBeans)
            .filter(it => it !== bean);

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
    allBeansWithoutCurrent: Bean[],
    dependency: Dependency,
    context: Configuration,
): void {
    const matchedByType = allBeansWithoutCurrent
        .filter(it => dependency.diType.isCompatible(it.diType));

    if (matchedByType.length === 1) {
        dependency.qualifiedBean = new DependencyQualifiedBean(matchedByType[0]);
        DependencyGraph.addNodeWithEdges(bean, matchedByType);
        return;
    }

    if (matchedByType.length > 1) {
        reportPossibleCandidates(dependency, allBeansWithoutCurrent, context);
        return;
    }

    const matchedByTypeAndName = matchedByType
        .filter(it => dependency.parameterName === it.classMemberName);

    if (matchedByTypeAndName.length === 1) {
        dependency.qualifiedBean = new DependencyQualifiedBean(matchedByTypeAndName[0]);
        DependencyGraph.addNodeWithEdges(bean, matchedByType);
        return;
    }

    if (matchedByTypeAndName.length > 1) {
        reportPossibleCandidates(dependency, allBeansWithoutCurrent, context);
        return;
    }

    const matchedByNestedType: DependencyQualifiedBean[] = [];

    allBeansWithoutCurrent.forEach(beanCandidate => {
        beanCandidate.embeddedElements.forEach((embeddedElement, embeddedName) => {
            if (dependency.diType.isCompatible(embeddedElement)) {
                matchedByNestedType.push(new DependencyQualifiedBean(beanCandidate, embeddedName));
            }
        });
    });

    if (matchedByNestedType.length === 1) {
        dependency.qualifiedBean = matchedByNestedType[0];
        DependencyGraph.addNodeWithEdges(bean, [matchedByNestedType[0].bean]);
        return;
    }

    if (matchedByNestedType.length > 1) {
        reportPossibleCandidates(dependency, allBeansWithoutCurrent, context);
        return;
    }

    //If no bean candidates and bean is optional just do nothing
    if (dependency.diType.isOptional) {
        return;
    }

    reportPossibleCandidates(dependency, allBeansWithoutCurrent, context);
}

function buildForCollectionOrArray(
    bean: Bean,
    allBeansWithoutCurrent: Bean[],
    dependency: Dependency,
): void {
    const otherCollectionsMatchedByNameAndType = allBeansWithoutCurrent.filter(it =>
        it.classMemberName === dependency.parameterName && dependency.diType.isCompatible(it.diType),
    );

    //If matched my name and type - just taking specific bean that returns collection
    if (otherCollectionsMatchedByNameAndType.length === 1) {
        dependency.qualifiedBean = new DependencyQualifiedBean(otherCollectionsMatchedByNameAndType[0]);
        DependencyGraph.addNodeWithEdges(bean, otherCollectionsMatchedByNameAndType);
        return;
    }

    const matched: DependencyQualifiedBean[] = [];

    if (dependency.diType.isMapStringToAny) {
        allBeansWithoutCurrent.forEach(beanCandidate => {
            if (dependency.diType.typeArguments[1].isCompatible(beanCandidate.diType)) {
                matched.push(new DependencyQualifiedBean(beanCandidate));
            }

            beanCandidate.embeddedElements.forEach((embeddedElement, embeddedName) => {
                if (dependency.diType.typeArguments[1].isCompatible(beanCandidate.diType)) {
                    matched.push(new DependencyQualifiedBean(beanCandidate, embeddedName));
                }
            });
        });
    } else {
        allBeansWithoutCurrent.forEach(beanCandidate => {
            if (dependency.diType.typeArguments[0].isCompatible(beanCandidate.diType)) {
                matched.push(new DependencyQualifiedBean(beanCandidate));
            }

            beanCandidate.embeddedElements.forEach((embeddedElement, embeddedName) => {
                if (dependency.diType.typeArguments[0].isCompatible(beanCandidate.diType)) {
                    matched.push(new DependencyQualifiedBean(beanCandidate, embeddedName));
                }
            });
        });
    }

    dependency.qualifiedBeans = matched;
    DependencyGraph.addNodeWithEdges(bean, matched.map(it => it.bean));
}

function reportPossibleCandidates(dependency: Dependency, allBeansWithoutCurrent: Bean[], configuration: Configuration): void {
    const compilationContext = getCompilationContext();
    const [
        byName,
        byType,
    ] = getPossibleBeanCandidates(dependency.parameterName, dependency.diType, allBeansWithoutCurrent);

    compilationContext.report(new MissingBeanDeclarationError(
        `Found ${byName.length + byType.length} candidates for parameter "${dependency.parameterName}". Rename parameter to match Bean name, to specify which Bean should be injected.`,
        dependency.node,
        configuration.node,
        byName,
        byType,
    ));
}
