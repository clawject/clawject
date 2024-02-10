import { Bean } from '../bean/Bean';
import { Dependency } from '../dependency/Dependency';

export class MaybeResolvedDependency {
  constructor(
    public readonly dependency: Dependency,
  ) {}

  qualifiedBean: Bean | null = null;
  /**
   * For array, map, set or in application mode
   * */
  qualifiedCollectionBeans: Bean[] | null = null;

  isResolved(): boolean {
    if (this.dependency.diType.isOptional) {
      return true;
    }

    if (this.qualifiedBean !== null) {
      return true;
    }

    if (this.qualifiedCollectionBeans !== null) {
      return true;
    }

    return this.dependency.diType.isEmptyValue;
  }

  getAllResolvedBeans(): Bean[] {
    if (this.qualifiedBean !== null) {
      return [this.qualifiedBean];
    }

    if (this.qualifiedCollectionBeans !== null) {
      return this.qualifiedCollectionBeans;
    }

    return [];
  }
}
