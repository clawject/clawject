import { ClassConstructor } from '../api/ClassConstructor';
import { MetadataStorage } from '../MetadataStorage';
import { RuntimeErrors } from '../api/RuntimeErrors';
import { RuntimeConfigurationMetadata } from '@clawject/core/runtime-metadata/RuntimeConfigurationMetadata';

export class ApplicationConfiguration {
  private _instance: any | null = null;
  private _index: number | null = null;

  get index(): number {
    if (this._index === null) {
      throw new RuntimeErrors.IllegalStateError('Id not initialized in application configuration');
    }

    return this._index;
  }

  constructor(
    public readonly classConstructor: ClassConstructor<any>,
    public readonly applicationClassConstructorParameters: any[],
  ) {}

  init(index: number): void {
    this._index = index;
  }

  get metadata(): RuntimeConfigurationMetadata {
    return this.getMetadataUnsafe(this.classConstructor);
  }

  get instance(): any {
    if (this._instance === null) {
      this._instance = new this.classConstructor(...this.applicationClassConstructorParameters);
    }

    return this._instance;
  }

  private getMetadataUnsafe(classConstructor: ClassConstructor<any>): RuntimeConfigurationMetadata {
    const metadata = MetadataStorage.getApplicationMetadata(classConstructor) ?? MetadataStorage.getConfigurationMetadata(classConstructor);

    if (metadata === null) {
      throw new RuntimeErrors.NoClassMetadataFoundError('No configuration metadata found');
    }

    return metadata;
  }
}
