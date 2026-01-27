import { ImportDefinition } from './api/import/ImportDefinition';
import { Symbols } from './api/Symbols';
import { BeanDefinition } from './api/bean/BeanDefinition';

export class Predicates {
  static isImportDefinition(value: unknown): value is ImportDefinition<any, any> {
    if (!value) {
      return false;
    }

    return Object.hasOwn(value, Symbols.Import);
  }

  static isBeanDefinition(value: unknown): value is BeanDefinition<any> {
    if (!value) {
      return false;
    }

    return Object.hasOwn(value, Symbols.Bean);
  }
}
