import { ClassConstructor } from '../ClassConstructor';

export const getConstructorFromInstance = (element: any): ClassConstructor<any> | null => {
  if (!element) {
    return null;
  }

  const objectPrototype = Object.getPrototypeOf(element);

  if (!objectPrototype) {
    return null;
  }

  return objectPrototype.constructor;
};
