import { CircularDependenciesError } from '../../compilation-context/messages/errors/CircularDependenciesError';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { Application } from '../application/Application';

export const reportAboutCircularDependencies = (application: Application) => {
  const compilationContext = getCompilationContext();
  const cycles = application.dependencyGraph.getCycle();

  cycles.forEach((cycle) => {
    if (cycle.length === 0) {
      return;
    }

    compilationContext.report(new CircularDependenciesError(
      cycle[0].node,
      cycle,
      application,
    ));
  });
};
