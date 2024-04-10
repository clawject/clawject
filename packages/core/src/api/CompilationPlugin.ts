import { Decorator } from './decorators/Decorator';

export interface CompilationPlugin {
  provideDecorators(): Decorator[];
}
