import { ClassConstructor } from './ClassConstructor';
import { ErrorBuilder } from './ErrorBuilder';

type BeanScope = 'prototype' | 'singleton';

interface BeanConfig {
    scope?: BeanScope;
}

type ConfigurableMethodBean = (beanConfig: BeanConfig) => PropertyDecorator;
type PropertyBean = <T>(clazz: ClassConstructor<T>, beanConfig?: BeanConfig) => T;

type Bean = PropertyDecorator & ConfigurableMethodBean & PropertyBean;
export const Bean: Bean = () => {
    throw ErrorBuilder.usageWithoutConfiguredDI('@Bean');
};
