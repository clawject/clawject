import { DependencyGraph } from '../dependencies/DependencyGraph';
import { CyclicDependenciesError } from '../../compilation-context/messages/errors/CyclicDependenciesError';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../transformer/getCompilationContext';

export const reportAboutCyclicDependencies = (
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
                compilationContext.report(new CyclicDependenciesError(
                    `${item.classMemberName} <—> ${otherDependencyNames.join(' <—> ')}.`,
                    item.node,
                    context.node,
                ));
            });
        });
    });
};
