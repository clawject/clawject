import { Configuration } from '../configuration/Configuration';
import { Entity } from '../Entity';
import type ts from 'typescript';
import { DependencyGraph } from '../dependency-graph/DependencyGraph';
import { Bean } from '../bean/Bean';
import { MaybeResolvedDependency } from '../dependency-resolver/MaybeResolvedDependency';
import { Graph } from 'graphlib';
import { traverseGraphFromSource } from '../graph-utils/traverseGraphFromSource';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { Import } from '../import/Import';
import { ResolvedDependency } from '../dependency-resolver/ResolvedDependency';

export class Application extends Entity<ts.ClassDeclaration> {
  constructor(public readonly rootConfiguration: Configuration) {
    super();
  }

  declare id: string;
  declare fileName: string;
  importGraph: Graph | null = null;
  dependencyGraph = new DependencyGraph();
  additionalFilesToAddDevelopmentMetadata = new Set<string>();

  resolvedBeanDependencies = new Map<Bean, ResolvedDependency[]>();

  private _configurationsArray: Configuration[] | null = null;
  get configurationsArray(): Configuration[] {
    if (!this.importGraph) {
      return [];
    }

    if (this._configurationsArray) {
      return this._configurationsArray;
    }

    this._configurationsArray = [];

    traverseGraphFromSource(
      this.importGraph,
      this.rootConfiguration.id,
      (node) =>
        ConfigurationRepository.configurationIdToConfiguration.get(node),
      (configuration: Configuration) => {
        this._configurationsArray!.push(configuration);
      }
    );

    return this._configurationsArray;
  }

  private _importsArray: Import[] | null = null;
  get importsArray(): Import[] {
    if (!this.importGraph) {
      return [];
    }

    if (this._importsArray) {
      return this._importsArray;
    }

    this._importsArray = [];

    this.configurationsArray.forEach((configuration) => {
      configuration.importRegister.elements.forEach((importInstance) => {
        this._importsArray!.push(importInstance);
      });
    });

    return this._importsArray;
  }

  private _beansArray: Bean[] | null = null;
  get beansArray(): Bean[] {
    if (!this.importGraph) {
      return [];
    }

    if (this._beansArray) {
      return this._beansArray;
    }

    this._beansArray = [];

    this.configurationsArray.forEach((configuration) => {
      configuration.beanRegister.elements.forEach((bean) => {
        this._beansArray!.push(bean);
      });
    });

    return this._beansArray;
  }

  exposedBeans = new Map<string, MaybeResolvedDependency>();
}
