import { DependencyGraph } from '../dependency-graph/DependencyGraph';
import { CircularDependenciesError } from '../../compilation-context/messages/errors/CircularDependenciesError';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export const reportAboutCircularDependencies = (
  context: Configuration
) => {
  const compilationContext = getCompilationContext();
  const cycle = DependencyGraph.getCycle();

  cycle.forEach((cycles, currentContext) => {
    if (context !== currentContext) {
      return;
    }

    cycles.forEach(cycle => {
      cycle.forEach(item => {
        compilationContext.report(new CircularDependenciesError(
          null,
          item.node.name,
          context,
          cycle
        ));
      });
    });
  });
};
