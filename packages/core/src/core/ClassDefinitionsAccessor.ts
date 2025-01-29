import type ts from 'typescript';
import { Context } from '../compilation-context/Context';
import { BaseTypesRepository } from './type-system/BaseTypesRepository';
import { CType } from './type-system/CType';

export class ClassDefinitions {
  beans: ts.Symbol[] = [];
  lifecycle: ts.Symbol[] = [];
  imports: ts.Symbol[] = [];
  configurations: ts.Symbol[] = [];
  applications: ts.Symbol[] = [];
  expose: ts.Symbol[] = [];

  isEmpty(): boolean {
    return (
      this.beans.length === 0 &&
      this.lifecycle.length === 0 &&
      this.imports.length === 0 &&
      this.configurations.length === 0 &&
      this.applications.length === 0 &&
      this.expose.length === 0
    );
  }
}

export class ClassDefinitionsAccessor {
  private static cache = new WeakMap<ts.ClassDeclaration, ClassDefinitions>();

  static getDefinition(node: ts.ClassDeclaration): ClassDefinitions {
    const cached = this.cache.get(node);
    if (cached) {
      return cached;
    }

    const classDefinition = new ClassDefinitions();

    const baseTypes = BaseTypesRepository.getBaseTypes();

    const propertySymbols = Context.typeChecker
      .getTypeAtLocation(node)
      .getProperties();

    for (const propertySymbol of propertySymbols) {
      const propertyType = Context.typeChecker.getTypeOfSymbol(propertySymbol);
      const cType = new CType(propertyType);
      if (cType.isAny()) {
        continue;
      }

      baseTypes.CBeanDefinition.isCompatibleNominally(cType) &&
        classDefinition.beans.push(propertySymbol);

      baseTypes.CLifecycleDefinition.isCompatibleNominally(cType) &&
        classDefinition.lifecycle.push(propertySymbol);

      baseTypes.CImportDefinition.isCompatibleNominally(cType) &&
        classDefinition.imports.push(propertySymbol);

      baseTypes.CConfigurationDefinition.isCompatibleNominally(cType) &&
        classDefinition.configurations.push(propertySymbol);

      baseTypes.CApplicationDefinition.isCompatibleNominally(cType) &&
        classDefinition.applications.push(propertySymbol);

      baseTypes.CExposeDefinition.isCompatibleNominally(cType) &&
        classDefinition.expose.push(propertySymbol);
    }

    this.cache.set(node, classDefinition);
    return classDefinition;
  }
}
