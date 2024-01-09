import { Dependency } from '../dependency/Dependency';
import { DIType } from '../type-system/DIType';
import { Bean } from '../bean/Bean';
import { FileGraph } from '../file-graph/FileGraph';
import { Configuration } from '../configuration/Configuration';

export class ImportedBean {
  dependencies = new Set<Dependency>();
  diType: DIType | null = null;

  constructor(
    public readonly parent: ImportedConfiguration,
    public readonly bean: Bean,
  ) {}

  registerDependency(dependency: Dependency): void {
    this.dependencies.add(dependency);
    dependency.diType.declarationFileNames.forEach(it => {
      FileGraph.add(this.bean.parentConfiguration.fileName, it);
    });
  }
}

export class ImportedConfiguration {
  importedBeans: ImportedBean[] = [];

  constructor(
    public readonly configuration: Configuration,
  ) {}
}
