import { ClassConstructor } from '../ClassConstructor';
import { RuntimeConfigurationMetadata } from '../metadata/RuntimeConfigurationMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

export class ApplicationConfiguration {
  private _instance: any | null = null;
  private _index: number | null = null;

  get index(): number {
    if (this._index === null) {
      //TODO runtime error
      throw new Error('Id not initialized');
    }

    return this._index;
  }

  constructor(
    public readonly classConstructor: ClassConstructor<any>,
  ) {}

  init(index: number): void {
    this._index = index;
  }

  get metadata(): RuntimeConfigurationMetadata {
    return this.getMetadataUnsafe(this.classConstructor);
  }

  get instance(): any {
    if (this._instance === null) {
      this._instance = new this.classConstructor();
    }

    return this._instance;
  }

  private getMetadataUnsafe(classConstructor: ClassConstructor<any>): RuntimeConfigurationMetadata {
    const metadata = MetadataStorage.getApplicationMetadata(classConstructor) ?? MetadataStorage.getConfigurationMetadata(classConstructor);

    if (metadata === null) {
      //TODO runtime error
      throw new Error('No configuration metadata found');
    }

    return metadata;
  }
}
