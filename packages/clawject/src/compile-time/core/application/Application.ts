import { alg, Graph } from 'graphlib';
import { Configuration } from '../configuration/Configuration';
import { analyzeGraph } from 'graph-cycles';
import { mapFilter } from '../utils/mapFilter';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { Entity } from '../Entity';
import ts from 'typescript';
import { Bean } from '../bean/Bean';
import { DIType } from '../type-system/DIType';
import { Dependency } from '../dependency/Dependency';
import { FileGraph } from '../file-graph/FileGraph';

export class ApplicationBean {
  dependencies = new Set<Dependency>();
  diType: DIType | null = null;

  constructor(
    public readonly bean: Bean,
  ) {}

  registerDependency(dependency: Dependency): void {
    this.dependencies.add(dependency);
    dependency.diType.declarationFileNames.forEach(it => {
      FileGraph.add(this.bean.parentConfiguration.fileName, it);
    });
  }
}

export class Application extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  className: string | null = null;
  rootConfiguration: Configuration | null = null;

  beans: ApplicationBean[] = [];

  configurationsGraph = new Graph();

  addConfigurationToGraph(node: Configuration, edges: Configuration[]) {
    edges.forEach(edge => this.configurationsGraph.setEdge(node.id, edge.id));
  }

  getConfigurationsCycle(): Configuration[][] {
    if (alg.isAcyclic(this.configurationsGraph)) {
      return [];
    }

    const { cycles } = analyzeGraph(
      this.configurationsGraph.nodes().map(node => {
        const nodeEdges = (this.configurationsGraph.outEdges(node) ?? []).map(it => it.w);

        return [node, nodeEdges];
      })
    );

    return cycles.map(idsList => {
      return mapFilter(
        idsList,
        it => ConfigurationRepository.configurationIdToConfiguration.get(it) ?? null,
        (it): it is Configuration => it !== null,
      );
    });
  }
}
