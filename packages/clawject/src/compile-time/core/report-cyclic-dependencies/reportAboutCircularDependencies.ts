import { DependencyGraph } from '../dependencies/DependencyGraph';
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
        const otherDependencyNames = cycle.filter(it => it !== item).map(it => it.classMemberName);
        compilationContext.report(new CircularDependenciesError(
          `${item.classMemberName} <—> ${otherDependencyNames.join(' <—> ')}.`,
          item.node,
          context.node,
        ));
      });
    });
  });
};
