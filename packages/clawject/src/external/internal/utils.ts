import { ClassConstructor } from '../ClassConstructor';

export const getConstructor = (element: any): ClassConstructor<any> | null => {
    if (!element) {
        return null;
    }

    return Object.getPrototypeOf(element).constructor;
};
