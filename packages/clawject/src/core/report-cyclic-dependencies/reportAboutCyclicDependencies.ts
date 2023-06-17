import { DependencyGraph } from '../dependencies/DependencyGraph';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { CyclicDependenciesError } from '../../compilation-context/messages/errors/CyclicDependenciesError';
import { Context } from '../context/Context';

export const reportAboutCyclicDependencies = (
    compilationContext: CompilationContext,
    context: Context
) => {
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
