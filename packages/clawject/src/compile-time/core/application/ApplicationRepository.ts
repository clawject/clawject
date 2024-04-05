import type * as ts from 'typescript';
import { Application } from './Application';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { Configuration } from '../configuration/Configuration';

export class ApplicationRepository {
  static fileNameToLastApplicationCounter = new Map<string, number>();
  static fileNameToApplications = new Map<string, Application[]>();
  static applicationIdToApplication = new Map<string, Application>();
  static nodeToApplication = new WeakMap<ts.ClassDeclaration, Application>();

  static register(classDeclaration: ts.ClassDeclaration, rootConfiguration: Configuration): Application {
    const sourceFile = classDeclaration.getSourceFile();

    const application = new Application(rootConfiguration);

    application.id = this.buildId(classDeclaration);
    application.fileName = classDeclaration.getSourceFile().fileName;
    application.node = classDeclaration;

    const applications = this.fileNameToApplications.get(sourceFile.fileName) ?? [];
    this.fileNameToApplications.set(sourceFile.fileName, applications);
    applications.push(application);

    this.applicationIdToApplication.set(application.id, application);
    this.nodeToApplication.set(classDeclaration, application);

    return application;
  }

  static clear(): void {
    this.fileNameToApplications.clear();
    this.fileNameToLastApplicationCounter.clear();
    this.applicationIdToApplication.clear();
  }

  static clearByFileName(fileName: string): void {
    const applications = this.fileNameToApplications.get(fileName) ?? [];

    this.fileNameToApplications.delete(fileName);
    this.fileNameToLastApplicationCounter.delete(fileName);
    applications.forEach(application => {
      this.applicationIdToApplication.delete(application.id);

      const configurationsFileNames = new Set<string>();
      application.forEachConfiguration(configuration => {
        configurationsFileNames.add(configuration.fileName);
      });

      configurationsFileNames.forEach(it => ConfigurationRepository.clearByFileName(it));
    });
  }

  private static buildId(classDeclaration: ts.ClassDeclaration): string {
    const sourceFile = classDeclaration.getSourceFile();
    const lastApplicationCounter = this.fileNameToLastApplicationCounter.get(sourceFile.fileName);
    const newCounter = (lastApplicationCounter ?? 0) + 1;
    this.fileNameToLastApplicationCounter.set(sourceFile.fileName, newCounter);

    return `${sourceFile.fileName}_${newCounter}`;
  }
}
