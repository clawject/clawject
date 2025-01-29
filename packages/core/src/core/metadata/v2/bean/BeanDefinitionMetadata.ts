import type ts from 'typescript';

export type BeanDefinitionMetadata = {
  primary: boolean | null;
  internal: boolean | null;
  embedded: boolean | null;
  names: string[];
  rawValueType: ts.Type;
  awaitedValueType: ts.Type;
  type: ts.Type;
}
