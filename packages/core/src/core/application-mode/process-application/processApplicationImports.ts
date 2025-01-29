import { Graph } from 'graphlib';
import { Application } from '../../application/Application';
import { Configuration } from '../../configuration/Configuration';

export const processApplicationImports = (application: Application): void => {
  application.importGraph = createImportGraph(application);
  // const allPaths = findAllPaths(configurationGraph, application.rootConfiguration.id);
};

function createImportGraph(application: Application): Graph {
  const configurationGraph = new Graph({ directed: true });
  const visitedChild = new Set<Configuration>();
  const stack: [parent: Configuration, child: Configuration][] = [];
  addToStack(stack, application.rootConfiguration);

  while (stack.length > 0) {
    const [parent, child] = stack.pop()!;
    configurationGraph.setEdge(parent.id, child.id);
    if (visitedChild.has(child)) {
      continue;
    }
    visitedChild.add(child);
    addToStack(stack, child);
  }

  return configurationGraph;
}

function addToStack(stack: [Configuration, Configuration][], parent: Configuration): void {
  for (const element of parent.importRegister.elements) {
    const resolvedConfiguration = element.resolvedConfiguration;
    stack.push([parent, resolvedConfiguration]);
  }
}
