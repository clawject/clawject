import { Entity } from '../Entity';
import { Configuration } from '../configuration/Configuration';
import { PropertyDeclaration } from 'typescript';

export class Import extends Entity<PropertyDeclaration> {
  declare id: string;
  declare parentConfiguration: Configuration;
  declare classMemberName: string;

  //objectPropertyName to Configuration
  resolvedConfigurations = new Map<string, Configuration>();

  constructor(values: Partial<Import> = {}) {
    super();

    Object.assign(this, values);
  }
}
