import { Configuration } from '../configuration/Configuration';
import { DependencyGraph } from './DependencyGraph';
import { Dependency } from '../dependency/Dependency';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { BeanCandidateNotFoundError } from '../../compilation-context/messages/errors/BeanCandidateNotFoundError';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';
import { CanNotRegisterBeanError } from '../../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanKind } from '../bean/BeanKind';

export const buildDependencyGraphAndFillQualifiedBeans = (context: Configuration) => {
  const compilationContext = getCompilationContext();
  const contextBeans = context.beanRegister.elements;

  contextBeans.forEach(bean => {
    const allBeansWithoutCurrent = Array.from(contextBeans)
      .filter(it => it !== bean);
    const missingDependencies: Dependency[] = [];

    bean.dependencies.forEach(dependency => {
      if (dependency.diType.isVoidUndefinedPlainUnionIntersection || dependency.diType.isNull) {
        return;
      }

      if (dependency.diType.isArray || dependency.diType.isSet || dependency.diType.isMapStringToAny) {
        buildForCollectionOrArray(bean, allBeansWithoutCurrent, dependency);
      } else {
        buildForBaseType(bean, allBeansWithoutCurrent, dependency, context, missingDependencies);
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
  configuration: Configuration,
  missingDependencies: Dependency[]
): void {
  const matchedByType = allBeansWithoutCurrent
    .filter(it => dependency.diType.isCompatible(it.diType));

  if (matchedByType.length === 1) {
    dependency.qualifiedBean = matchedByType[0];
    DependencyGraph.addNodeWithEdges(bean, matchedByType);
    return;
  }

  const matchedByTypeAndName = matchedByType
    .filter(it => {
      return dependency.parameterName === it.fullName;
    });

  if (matchedByTypeAndName.length === 1) {
    dependency.qualifiedBean = matchedByTypeAndName[0];
    DependencyGraph.addNodeWithEdges(bean, matchedByType);
    return;
  }

  const matchedByTypeAndPrimary = matchedByType
    .filter(it => it.primary);

  if (matchedByTypeAndPrimary.length === 1) {
    dependency.qualifiedBean = matchedByTypeAndPrimary[0];
    DependencyGraph.addNodeWithEdges(bean, matchedByTypeAndPrimary);
    return;
  }

  if (matchedByTypeAndPrimary.length > 1) {
    const error = new BeanCandidateNotFoundError(
      `Found ${matchedByTypeAndPrimary.length} Primary injection candidates.`,
      dependency.node,
      configuration,
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

  reportPossibleCandidates(bean, dependency, allBeansWithoutCurrent, configuration, missingDependencies);
}

function buildForCollectionOrArray(
  bean: Bean,
  allBeansWithoutCurrent: Bean[],
  dependency: Dependency,
): void {
  const otherCollectionsMatchedByNameAndType = allBeansWithoutCurrent.filter(it =>
    it.fullName === dependency.parameterName && dependency.diType.isCompatible(it.diType),
  );

  //If matched my name and type - just taking specific bean that returns collection
  if (otherCollectionsMatchedByNameAndType.length === 1) {
    dependency.qualifiedBean = otherCollectionsMatchedByNameAndType[0];
    DependencyGraph.addNodeWithEdges(bean, otherCollectionsMatchedByNameAndType);
    return;
  }

  const matched: Bean[] = [];

  if (dependency.diType.isMapStringToAny) {
    allBeansWithoutCurrent.forEach(beanCandidate => {
      if (dependency.diType.isUnionOrIntersection) {
        dependency.diType.unionOrIntersectionTypes.every(it => it.typeArguments[1].isCompatible(beanCandidate.diType))
        && matched.push(beanCandidate);
      } else {
        dependency.diType.typeArguments[1].isCompatible(beanCandidate.diType)
        && matched.push(beanCandidate);
      }
    });
  } else {
    allBeansWithoutCurrent.forEach(beanCandidate => {
      if (dependency.diType.isUnionOrIntersection) {
        dependency.diType.unionOrIntersectionTypes.every(it => it.typeArguments[0].isCompatible(beanCandidate.diType))
        && matched.push(beanCandidate);
      } else {
        dependency.diType.typeArguments[0].isCompatible(beanCandidate.diType)
        && matched.push(beanCandidate);
      }
    });
  }

  dependency.qualifiedCollectionBeans = matched;
  DependencyGraph.addNodeWithEdges(bean, matched);
}

function reportPossibleCandidates(
  bean: Bean,
  dependency: Dependency,
  allBeansWithoutCurrent: Bean[],
  configuration: Configuration,
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
    configuration,
    bean,
    byName,
    byType,
  ));
  missingDependencies.push(dependency);
}
