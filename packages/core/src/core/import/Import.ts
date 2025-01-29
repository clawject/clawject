import { PropertyDeclaration } from 'typescript';
import { Entity } from '../Entity';
import { Configuration } from '../configuration/Configuration';
import { ImportDefinitionMetadata } from '../metadata/v2/import/ImportDefinitionMetadata';

export class Import extends Entity<PropertyDeclaration> {
  declare id: string;
  declare parentConfiguration: Configuration;
  declare classMemberName: string;
  declare resolvedConfiguration: Configuration;
  declare definitionMetadata: ImportDefinitionMetadata;

  constructor(values: Partial<Import> = {}) {
    super();

    Object.assign(this, values);
  }
}
