import { ApplicationDefinition } from './ApplicationDefinition';
import { ApplicationDefinitionImpl } from './ApplicationDefinitionImpl';

/**
 * Indicates that a target class is a Application class, and can contains bean definitions, configuration imports.
 *
 * @public
 */
export const ClawjectApplication = (): ApplicationDefinition<any, any, any> => {
  return new ApplicationDefinitionImpl();
};
