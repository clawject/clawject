import { DecoratorWithoutArguments } from './DecoratorWithoutArguments';
import { ErrorBuilder } from '../ErrorBuilder';
import { NotEmptyArray } from '../types/NotEmptyArray';

export interface ComponentScanOptions {
  baseDir?: string | NotEmptyArray<string>;
  pattern?: string | NotEmptyArray<string>;
}
export type ComponentScanTarget = ClassDecorator;
export type ComponentScanWithOptions = (options: ComponentScanOptions | ComponentScanOptions[]) => ComponentScanTarget;
export const ComponentScan: DecoratorWithoutArguments<ComponentScanTarget> & ComponentScanWithOptions = () => {
  throw ErrorBuilder.usageWithoutConfiguredDI('@ComponentScan');
};
