import { ImportDefinition } from './ImportDefinition';
import { MaybePromise } from '../../types/MaybePromise';
import { ClassConstructor } from '../ClassConstructor';
import { TypeHolder } from '../UtilityTypes';
import { Symbols } from '../Symbols';
import { JustReturn } from '../JustReturn';

export class ImportDefinitionImpl<
  Constructor extends MaybePromise<ClassConstructor<any>>,
  Lazy extends boolean = any
> implements ImportDefinition<Constructor, Lazy>
{
  [Symbols.Import] = undefined;

  classConstructor: Constructor;
  constructorParams: () => MaybePromise<ConstructorParameters<Awaited<Constructor>>>;
  metadata: {
    readonly type: TypeHolder<InstanceType<Awaited<Constructor>>>;
    readonly lazy: Lazy;
  };
  constructor(
    classConstructor: Constructor,
    constructorParams: (typeof this)['constructorParams'],
    metadata?: (typeof this)['metadata']
  ) {
    this.classConstructor = classConstructor;
    this.constructorParams = constructorParams;

    this.metadata = metadata ?? {
      type: JustReturn,
      internal: true,
      lazy: false
    } as any;
  }

  lazy<V extends boolean = true>(v?: V): any {
    return new ImportDefinitionImpl(
      this.classConstructor,
      this.constructorParams,
      {
        ...this.metadata,
        lazy: v ?? true,
      } as any
    );
  }
}
