import { ClassConstructor } from '../ClassConstructor';
import { ErrorBuilder } from '../ErrorBuilder';

export type BeanScope = 'prototype' | 'singleton' | string;

export interface BeanConfig {
    scope?: BeanScope;
    lazy?: boolean;
}

type ConfigurableMethodBean = (beanConfig: BeanConfig) => PropertyDecorator;
type PropertyBean = <T>(clazz: ClassConstructor<T>, beanConfig?: BeanConfig) => T;

type Bean = PropertyDecorator & ConfigurableMethodBean & PropertyBean;
export const Bean: Bean = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
