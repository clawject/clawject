import { Bean } from '../bean/Bean';
import { Dependency } from './Dependency';

export class ResolvedDependency {
  constructor(
    public readonly bean: Bean,
    public readonly dependency: Dependency,
  ) {}

  qualifiedBean: Bean | null = null;
  /**
   * For array, map, set or in application mode
   * */
  qualifiedCollectionBeans: Bean[] | null = null;
}
