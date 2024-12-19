import { Bean } from '../bean/Bean';
import { MaybeResolvedDependency } from './MaybeResolvedDependency';
import { Dependency } from '../dependency/Dependency';
import { BeanCandidateNotFoundError } from '../../compilation-context/messages/errors/BeanCandidateNotFoundError';
import { getPossibleBeanCandidates } from '../utils/getPossibleBeanCandidates';
import { Application } from '../application/Application';
import { Context } from '../../compilation-context/Context';

export class DependencyResolver {
  static resolveDependencies(
    dependency: Dependency,
    beansToSearch: Bean[],
    relatedBean: Bean | null,
    relatedApplication: Application,
  ): MaybeResolvedDependency {
    switch (true) {
    case dependency.cType.isNever(): {
      this.reportPossibleCandidates(relatedBean, dependency, beansToSearch, relatedApplication);
      return new MaybeResolvedDependency(dependency);
    }

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
    beansToSearch: Bean[],
    relatedBean: Bean | null,
    relatedApplication: Application,
  ): MaybeResolvedDependency {
    const resolvedDependency = new MaybeResolvedDependency(dependency);

    const matchedByType =
      beansToSearch.filter(it => dependency.cType.isCompatibleToPossiblePromise(it.cType));

    if (matchedByType.length === 1) {
      resolvedDependency.qualifiedBean = matchedByType[0];
      return resolvedDependency;
    }

    const matchedByTypeAndName =
      matchedByType.filter(it => dependency.parameterName === it.fullName);

    if (matchedByTypeAndName.length === 1) {
      resolvedDependency.qualifiedBean = matchedByTypeAndName[0];
      return resolvedDependency;
    }

    const matchedByTypeAndPrimary = matchedByType.filter(it => it.primary);

    if (matchedByTypeAndPrimary.length === 1) {
      resolvedDependency.qualifiedBean = matchedByTypeAndPrimary[0];
      return resolvedDependency;
    }

    if (matchedByTypeAndPrimary.length > 1) {
      Context.report(new BeanCandidateNotFoundError(
        `Found ${matchedByTypeAndPrimary.length} Primary injection candidates.`,
        dependency.node,
        relatedBean,
        matchedByTypeAndPrimary,
        relatedApplication,
      ));
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
    beansToSearch: Bean[],
  ): MaybeResolvedDependency {
    const resolvedDependency = new MaybeResolvedDependency(dependency);

    const otherCollectionsMatchedByNameAndType = beansToSearch.filter(it =>
      it.fullName === dependency.parameterName && dependency.cType.isCompatibleToPossiblePromise(it.cType)
    );

    //If matched my name and type - just taking specific bean that returns collection
    if (otherCollectionsMatchedByNameAndType.length === 1) {
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
    beansToSearch: Bean[],
    relatedApplication: Application,
  ): void {
    const possibleBeanCandidates = getPossibleBeanCandidates(dependency.cType, beansToSearch);

    Context.report(new BeanCandidateNotFoundError(
      `Found ${possibleBeanCandidates.length} injection candidates.`,
      dependency.node,
      bean,
      possibleBeanCandidates,
      relatedApplication,
    ));
  }
}
