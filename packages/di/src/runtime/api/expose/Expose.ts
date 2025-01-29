import { ExposeDefinition } from './ExposeDefinition';
import { ExposeDefinitionImpl } from './ExposeDefinitionImpl';

export const Expose = <Exposed extends Record<string, any>>(): ExposeDefinition<Exposed> => {
  return new ExposeDefinitionImpl();
};
