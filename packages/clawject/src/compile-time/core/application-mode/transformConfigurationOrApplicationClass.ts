import ts from 'typescript';
import { Configuration } from '../configuration/Configuration';
import { Application } from '../application/Application';

export const transformConfigurationOrApplicationClass = (node: ts.ClassDeclaration, configuration: Configuration, application: Application | null): ts.ClassDeclaration => {
  //TODO
  return node;
};
