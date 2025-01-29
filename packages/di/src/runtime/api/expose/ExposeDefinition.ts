import { Symbols } from '../Symbols';
import { TypeHolder } from '../UtilityTypes';

export interface ExposeDefinition<Exposed extends Record<string, any>> {
  [Symbols.Expose]: void;

  readonly metadata: {
    readonly exposed: TypeHolder<Exposed>;
  };
}
