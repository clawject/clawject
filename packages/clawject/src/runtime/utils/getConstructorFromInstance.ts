import { ClassConstructor } from '../ClassConstructor';

export const getConstructorFromInstance = (element: any): ClassConstructor<any> | null => {
  if (!element) {
    return null;
  }

  return Object.getPrototypeOf(element).constructor;
};
