import { Configuration } from '../configuration/Configuration';
import { DependencyGraph } from './DependencyGraph';
import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { BeanCandidateNotFoundError } from '../../compilation-context/messages/errors/BeanCandidateNotFoundError';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';
import { CanNotRegisterBeanError } from '../../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanKind } from '../bean/BeanKind';
import { ResolvedDependency } from '../dependency/ResolvedDependency';
import { Application } from '../application/Application';

export const buildDependencyGraphAndFillQualifiedBeans = (configurationOrApplication: Configuration | Application, beans: Bean[], dependencyGraph: DependencyGraph) => {
  const compilationContext = getCompilationContext();

  beans.forEach(bean => {
    //TODO check for external and internal beans
    const allBeansWithoutCurrentAndWithoutExternalInternalBeans = beans
      .filter(it => {
        return it !== bean;
      });
    const missingDependencies: Dependency[] = [];

    bean.dependencies.forEach(dependency => {
      if (dependency.diType.isEmptyValue) {
        const resolvedDependency = new ResolvedDependency(bean, dependency);
        configurationOrApplication.registerResolvedDependency(bean, resolvedDependency);
        return;
      }
      if (dependency.diType.isArray || dependency.diType.isSet || dependency.diType.isMapStringToAny) {
        buildForCollectionOrArray(bean, allBeansWithoutCurrentAndWithoutExternalInternalBeans, dependency, dependencyGraph, configurationOrApplication);
      } else {
        buildForBaseType(bean, allBeansWithoutCurrentAndWithoutExternalInternalBeans, dependency, missingDependencies, dependencyGraph, configurationOrApplication);
      }
    });

    if (missingDependencies.length > 0 && bean.kind === BeanKind.CLASS_CONSTRUCTOR) {
      compilationContext.report(new CanNotRegisterBeanError(
        null,
        bean.node,
        bean.parentConfiguration,
        missingDependencies,
      ));
    }
  });
};

function buildForBaseType(
  bean: Bean,
  allBeansWithoutCurrent: Bean[],
  dependency: Dependency,
  missingDependencies: Dependency[],
  dependencyGraph: DependencyGraph,
  configurationOrApplication: Configuration | Application,
): void {
  const resolvedDependency = new ResolvedDependency(bean, dependency);
  configurationOrApplication.registerResolvedDependency(bean, resolvedDependency);

  const matchedByType = allBeansWithoutCurrent
    .filter(it => dependency.diType.isCompatibleToPossiblePromise(it.diType));

  if (matchedByType.length === 1) {
    resolvedDependency.qualifiedBean = matchedByType[0];
    dependencyGraph.addNodeWithEdges(bean, matchedByType);
    return;
  }

  const matchedByTypeAndName = matchedByType
    .filter(it => {
      return dependency.parameterName === it.fullName;
    });

  if (matchedByTypeAndName.length === 1) {
    resolvedDependency.qualifiedBean = matchedByTypeAndName[0];
    dependencyGraph.addNodeWithEdges(bean, matchedByType);
    return;
  }

  const matchedByTypeAndPrimary = matchedByType
    .filter(it => it.primary);

  if (matchedByTypeAndPrimary.length === 1) {
    resolvedDependency.qualifiedBean = matchedByTypeAndPrimary[0];
    dependencyGraph.addNodeWithEdges(bean, matchedByTypeAndPrimary);
    return;
  }

  if (matchedByTypeAndPrimary.length > 1) {
    const error = new BeanCandidateNotFoundError(
      `Found ${matchedByTypeAndPrimary.length} Primary injection candidates.`,
      dependency.node,
      bean,
      [],
      matchedByTypeAndPrimary,
    );
    getCompilationContext().report(error);
    missingDependencies.push(dependency);
    return;
  }

  //If no bean candidates and bean is optional just do nothing
  if (dependency.diType.isOptional) {
    return;
  }

  reportPossibleCandidates(bean, dependency, allBeansWithoutCurrent, missingDependencies);
}

function buildForCollectionOrArray(
  bean: Bean,
  allBeansWithoutCurrent: Bean[],
  dependency: Dependency,
  dependencyGraph: DependencyGraph,
  configurationOrApplication: Configuration | Application,
): void {
  const resolvedDependency = new ResolvedDependency(bean, dependency);
  configurationOrApplication.registerResolvedDependency(bean, resolvedDependency);

  const otherCollectionsMatchedByNameAndType = allBeansWithoutCurrent.filter(it =>
    it.fullName === dependency.parameterName && dependency.diType.isCompatibleToPossiblePromise(it.diType),
  );

  //If matched my name and type - just taking specific bean that returns collection
  if (otherCollectionsMatchedByNameAndType.length === 1) {
    resolvedDependency.qualifiedBean = otherCollectionsMatchedByNameAndType[0];
    dependencyGraph.addNodeWithEdges(bean, otherCollectionsMatchedByNameAndType);
    return;
  }

  const matched: Bean[] = [];

  if (dependency.diType.isMapStringToAny) {
    allBeansWithoutCurrent.forEach(beanCandidate => {
      if (dependency.diType.isUnionOrIntersection) {
        dependency.diType.unionOrIntersectionTypes.every(it => it.typeArguments[1].isCompatibleToPossiblePromise(beanCandidate.diType))
        && matched.push(beanCandidate);
      } else {
        dependency.diType.typeArguments[1].isCompatibleToPossiblePromise(beanCandidate.diType)
        && matched.push(beanCandidate);
      }
    });
  } else {
    allBeansWithoutCurrent.forEach(beanCandidate => {
      if (dependency.diType.isUnionOrIntersection) {
        dependency.diType.unionOrIntersectionTypes.every(it => it.typeArguments[0].isCompatibleToPossiblePromise(beanCandidate.diType))
        && matched.push(beanCandidate);
      } else {
        dependency.diType.typeArguments[0].isCompatibleToPossiblePromise(beanCandidate.diType)
        && matched.push(beanCandidate);
      }
    });
  }

  resolvedDependency.qualifiedCollectionBeans = matched;
  dependencyGraph.addNodeWithEdges(bean, matched);
}

function reportPossibleCandidates(
  bean: Bean,
  dependency: Dependency,
  allBeansWithoutCurrent: Bean[],
  missingDependencies: Dependency[]
): void {
  const compilationContext = getCompilationContext();
  const [
    byName,
    byType,
  ] = getPossibleBeanCandidates(dependency.parameterName, dependency.diType, allBeansWithoutCurrent);

  compilationContext.report(new BeanCandidateNotFoundError(
    `Found ${byName.length + byType.length} injection candidates.`,
    dependency.node,
    bean,
    byName,
    byType,
  ));
  missingDependencies.push(dependency);
}
