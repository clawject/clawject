import { Import } from '../import/Import';
import { Configuration } from '../configuration/Configuration';
import { ConfigLoader } from '../../config/ConfigLoader';

export class ResolvedConfigurationImport {
  private external: boolean | null = null;

  constructor(
    public imports: Import[],
    public configuration: Configuration,
  ) {

    imports.forEach(it => {
      this.external = this.external || (it.external ?? ConfigLoader.get().imports.defaultExternal);
    });
  }

  getExternalValue(): boolean {
    return this.external ?? ConfigLoader.get().imports.defaultExternal;
  }
}
