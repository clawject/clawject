import { ConfigurationDefinition } from './ConfigurationDefinition';
import { ConfigurationDefinitionImpl } from './ConfigurationDefinitionImpl';

/**
 * Indicates that a target class is a Configuration class, and can contains bean definitions, configuration imports.
 *
 * @docs https://clawject.com/docs/fundamentals/configurations
 *
 * @public
 */
export const Configuration = (): ConfigurationDefinition<any> => {
  return new ConfigurationDefinitionImpl();
};
