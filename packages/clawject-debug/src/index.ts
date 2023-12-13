import {A, B} from './Interface';
import {ClassConstructor} from '@clawject/di';

function a<T>(arg: ClassConstructor<T>): T {
  return arg as any;
}

export class ApplicationContext {
  aaaa = a(A);
  bbbb = a(B);
}
