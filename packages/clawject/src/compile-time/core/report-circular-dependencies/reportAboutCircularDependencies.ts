import { CircularDependenciesError } from '../../compilation-context/messages/errors/CircularDependenciesError';
import { Application } from '../application/Application';
import { Context } from '../../compilation-context/Context';

export const reportAboutCircularDependencies = (application: Application) => {
  const cycles = application.dependencyGraph.getCycle();

  cycles.forEach((cycle) => {
    if (cycle.length === 0) {
      return;
    }

    Context.report(new CircularDependenciesError(
      cycle[0].node,
      cycle,
      application,
    ));
  });
};
