import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';

export type BeanScope = 'prototype' | 'singleton' | string;

type Bean = PropertyDecorator & (<T>(this: void, classConstructor: ClassConstructor<T>) => T);
export const Bean: Bean = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
