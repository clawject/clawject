import { CompilationContext } from '../compile-time/compilation-context/CompilationContext';

let context: CompilationContext | null = null;

export function getCompilationContext(): CompilationContext {
    context = context ?? new CompilationContext();

    return context;
}
