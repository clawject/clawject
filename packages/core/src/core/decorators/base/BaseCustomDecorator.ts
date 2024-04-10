import { CONSTANTS } from '../../../constants/index';
import { Decorator } from '../../../api/decorators/Decorator';

export abstract class BaseCustomDecorator extends Decorator {
  moduleName = '@clawject/di';

  protected abstract compatibleDecorators: Set<string>;

  isCompatibleWith(decorator: Decorator): boolean | null {
    if (this.moduleName !== this.moduleName) {
      return null;
    }

    return this.compatibleDecorators.has(decorator.name);
  }

  predicate(declarationFilePath: string): boolean {
    return declarationFilePath.startsWith(CONSTANTS.packageRootDir);
  }
}
