import { ScopeValue } from '../decorators';

export interface RuntimeBeanMetadata {
  scope: ScopeValue | null;
  public: boolean;
  lazy: boolean | null;
}
