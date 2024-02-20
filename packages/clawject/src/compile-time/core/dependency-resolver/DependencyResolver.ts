import { Bean } from '../bean/Bean';
import { MaybeResolvedDependency } from './MaybeResolvedDependency';
import { Dependency } from '../dependency/Dependency';
import { BeanCandidateNotFoundError } from '../../compilation-context/messages/errors/BeanCandidateNotFoundError';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';
import { Application } from '../application/Application';
import { filterSet } from '../utils/filterSet';

export class DependencyResolver {
  static resolveDependencies(
    dependency: Dependency,
    beansToSearch: Set<Bean>,
    relatedBean: Bean | null,
    relatedApplication: Application,
  ): MaybeResolvedDependency {
    switch (true) {
    case dependency.cType.isEmptyValue():
      return new MaybeResolvedDependency(dependency);

    case dependency.cType.isArray():
    case dependency.cType.isSet():
    case dependency.cType.isMapStringToAny():
      return this.buildForCollectionOrArray(dependency, beansToSearch);

    default:
      return this.buildForBaseType(dependency, beansToSearch, relatedBean, relatedApplication);
    }
  }

  private static buildForBaseType(
    dependency: Dependency,
    beansToSearch: Set<Bean>,
    relatedBean: Bean | null,
    relatedApplication: Application,
  ): MaybeResolvedDependency {
    const resolvedDependency = new MaybeResolvedDependency(dependency);

    const matchedByType = filterSet(
      beansToSearch,
      it => dependency.cType.isCompatibleToPossiblePromise(it.cType )
    );

    if (matchedByType.size === 1) {
      resolvedDependency.qualifiedBean = matchedByType[0];
      return resolvedDependency;
    }

    const matchedByTypeAndName = filterSet(
      matchedByType,
      it => dependency.parameterName === it.fullName
    );

    if (matchedByTypeAndName.size === 1) {
      resolvedDependency.qualifiedBean = matchedByTypeAndName[0];
      return resolvedDependency;
    }

    const matchedByTypeAndPrimary = filterSet(matchedByType, it => it.primary);

    if (matchedByTypeAndPrimary.size === 1) {
      resolvedDependency.qualifiedBean = matchedByTypeAndPrimary[0];
      return resolvedDependency;
    }

    if (matchedByTypeAndPrimary.size > 1) {
      const error = new BeanCandidateNotFoundError(
        `Found ${matchedByTypeAndPrimary.size} Primary injection candidates.`,
        dependency.node,
        relatedBean,
        new Set(),
        matchedByTypeAndPrimary,
        relatedApplication,
      );
      getCompilationContext().report(error);
      return resolvedDependency;
    }

    //If no bean candidates and bean is optional just do nothing
    if (dependency.cType.isOptional()) {
      return resolvedDependency;
    }

    this.reportPossibleCandidates(relatedBean, dependency, beansToSearch, relatedApplication);

    return resolvedDependency;
  }

  private static buildForCollectionOrArray(
    dependency: Dependency,
    beansToSearch: Set<Bean>,
  ): MaybeResolvedDependency {
    const resolvedDependency = new MaybeResolvedDependency(dependency);

    const otherCollectionsMatchedByNameAndType = filterSet(
      beansToSearch,
      it => it.fullName === dependency.parameterName && dependency.cType.isCompatibleToPossiblePromise(it.cType)
    );

    //If matched my name and type - just taking specific bean that returns collection
    if (otherCollectionsMatchedByNameAndType.size === 1) {
      resolvedDependency.qualifiedBean = otherCollectionsMatchedByNameAndType[0];
      return resolvedDependency;
    }

    const matched: Bean[] = [];

    if (dependency.cType.isMapStringToAny()) {
      beansToSearch.forEach(beanCandidate => {
        if (dependency.cType.isUnionOrIntersection()) {
          dependency.cType.getUnionOrIntersectionTypes()?.every(it => it.getTypeArguments()?.[1].isCompatibleToPossiblePromise(beanCandidate.cType))
          && matched.push(beanCandidate);
        } else {
          dependency.cType.getTypeArguments()?.[1].isCompatibleToPossiblePromise(beanCandidate.cType)
          && matched.push(beanCandidate);
        }
      });
    } else {
      beansToSearch.forEach(beanCandidate => {
        if (dependency.cType.isUnionOrIntersection()) {
          dependency.cType.getUnionOrIntersectionTypes()?.every(it => it.getTypeArguments()?.[0].isCompatibleToPossiblePromise(beanCandidate.cType))
          && matched.push(beanCandidate);
        } else {
          dependency.cType.getTypeArguments()?.[0].isCompatibleToPossiblePromise(beanCandidate.cType)
          && matched.push(beanCandidate);
        }
      });
    }

    resolvedDependency.qualifiedCollectionBeans = matched;

    return resolvedDependency;
  }

  private static reportPossibleCandidates(
    bean: Bean | null,
    dependency: Dependency,
    beansToSearch: Set<Bean>,
    relatedApplication: Application,
  ): void {
    const compilationContext = getCompilationContext();
    const [
      byName,
      byType,
    ] = getPossibleBeanCandidates(dependency.parameterName, dependency.cType, beansToSearch);

    compilationContext.report(new BeanCandidateNotFoundError(
      `Found ${byName.size + byType.size} injection candidates.`,
      dependency.node,
      bean,
      byName,
      byType,
      relatedApplication,
    ));
  }
}
