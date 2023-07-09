export function Autowired(property: any, context: any);
export function Autowired<T>(): T;
/**
 * Legacy decorators
 * */
export function Autowired(target: Object, propertyKey: string | symbol);
export function Autowired() {
  throw new Error('TODO');
}
