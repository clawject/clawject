import type ts from 'typescript';
import { BeanRegister } from '../bean/BeanRegister';
import { Entity } from '../Entity';
import { ImportRegister } from '../import/ImportRegister';
import { ConfigurationDefinitionMetadata } from '../metadata/v2/configuration/ConfigurationDefinitionMetadata';

export class Configuration extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  declare definitionMetadata: ConfigurationDefinitionMetadata;

  className: string | null = null;
  external: boolean | null = null;

  importRegister = new ImportRegister(this);
  beanRegister = new BeanRegister(this);
}
