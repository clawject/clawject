import { Symbols } from '../Symbols';
import { ExposeDefinition } from './ExposeDefinition';
import { JustReturn } from '../JustReturn';

export class ExposeDefinitionImpl implements ExposeDefinition<any> {
  [Symbols.Expose] = undefined;

  metadata = {
    exposed: JustReturn,
  };
}
