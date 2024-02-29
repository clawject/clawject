import ts from 'typescript';
import { Component } from './Component';
import { unquoteString } from '../utils/unquoteString';

export class ComponentRepository {
  static fileNameToLastComponentCounter = new Map<string, number>();
  static fileNameToComponents = new Map<string, Component[]>();
  static componentIdToComponent = new Map<string, Component>();

  static register(classDeclaration: ts.ClassDeclaration, explicit: boolean): Component {
    const sourceFile = classDeclaration.getSourceFile();

    const component = new Component();

    component.id = this.buildId(classDeclaration);
    component.fileName = classDeclaration.getSourceFile().fileName;
    component.explicitDeclaration = explicit;
    component.node = classDeclaration;

    if (classDeclaration.name !== undefined) {
      component.className = unquoteString(classDeclaration.name.getText());
    }

    const components = this.fileNameToComponents.get(sourceFile.fileName) ?? [];
    this.fileNameToComponents.set(sourceFile.fileName, components);
    components.push(component);

    this.componentIdToComponent.set(component.id, component);

    return component;
  }

  static clear(): void {
    this.fileNameToComponents.clear();
    this.fileNameToLastComponentCounter.clear();
    this.componentIdToComponent.clear();
  }

  static clearByContextualFileName(fileName: string): void {
    const components = this.fileNameToComponents.get(fileName) ?? [];

    this.fileNameToComponents.delete(fileName);
    this.fileNameToLastComponentCounter.delete(fileName);
    components.forEach(component => {
      this.componentIdToComponent.delete(component.id);
    });
  }

  private static buildId(classDeclaration: ts.ClassDeclaration): string {
    const sourceFile = classDeclaration.getSourceFile();
    const lastComponentCounter = this.fileNameToLastComponentCounter.get(sourceFile.fileName);
    const newCounter = (lastComponentCounter ?? 0) + 1;
    this.fileNameToLastComponentCounter.set(sourceFile.fileName, newCounter);

    return `${sourceFile.fileName}_${newCounter}`;
  }
}
