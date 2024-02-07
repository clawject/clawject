import { DependencyGraph } from '../dependency-graph/DependencyGraph';
import { CircularDependenciesError } from '../../compilation-context/messages/errors/CircularDependenciesError';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export const reportAboutCircularDependencies = (dependencyGraph: DependencyGraph) => {
  const compilationContext = getCompilationContext();
  const cycles = dependencyGraph.getCycle();

  cycles.forEach((cycle) => {
    compilationContext.report(new CircularDependenciesError(
      cycle[0].node.name,
      cycle
    ));
  });
};
