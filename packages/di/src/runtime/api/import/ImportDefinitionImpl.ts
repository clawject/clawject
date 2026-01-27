import { ImportDefinition } from './ImportDefinition';
import { MaybePromise } from '../../types/MaybePromise';
import { ClassConstructor } from '../ClassConstructor';
import { TypeHolder } from '../UtilityTypes';
import { Symbols } from '../Symbols';
import { JustReturn } from '../JustReturn';

export class ImportDefinitionImpl<
  Value extends () => MaybePromise<ClassConstructor<any>>,
  Lazy extends boolean = any
> implements ImportDefinition<Value, Lazy>
{
  [Symbols.Import] = undefined;

  value: () => Value;
  constructorParams: () => MaybePromise<
    ConstructorParameters<Awaited<ReturnType<Value>>>
  >;
  metadata: {
    readonly type: TypeHolder<InstanceType<Awaited<ReturnType<Value>>>>;
    readonly lazy: Lazy;
  };

  constructor(
    value: () => Value,
    constructorParams: (typeof this)['constructorParams'],
    lazy: Lazy
  ) {
    this.value = value;
    this.constructorParams = constructorParams;

    this.metadata = {
      type: JustReturn,
      lazy: lazy,
    } as any;
  }

  lazy<V extends boolean = true>(v?: V): ImportDefinition<Value, V> {
    return new ImportDefinitionImpl(this.value, this.constructorParams, v ?? true) as any;
  }
}
