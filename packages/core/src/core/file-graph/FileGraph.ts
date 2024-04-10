import graphlib from 'graphlib';

const { Graph, alg } = graphlib;

export class FileGraph {
  private static graph = new Graph();

  static add(targetFileName: string, relatedFileNames: string | string[]): void {
    const actualRelatedFileNames = Array.isArray(relatedFileNames) ? relatedFileNames : [relatedFileNames];

    actualRelatedFileNames.forEach(referencedFileName => {
      this.graph.setEdge(targetFileName, referencedFileName);
    });
  }

  static getRelatedFileNamesWithTarget(fileNames: string | string[]): Set<string> {
    const stronglyConnectedComponents = alg.components(this.graph).map(it => new Set(it));
    const allEdges = new Set([fileNames].flat());

    [fileNames].flat().forEach(fileName => {
      stronglyConnectedComponents.forEach(stronglyConnectedComponentSet => {
        if (stronglyConnectedComponentSet.has(fileName)) {
          stronglyConnectedComponentSet.forEach(it => allEdges.add(it));
        }
      });
    });

    return allEdges;
  }

  static clearByFileName(fileName: string): void {
    this.graph.removeNode(fileName);
  }

  static clear(): void {
    this.graph = new Graph();
  }
}
