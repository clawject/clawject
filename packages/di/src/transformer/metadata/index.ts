import type * as ts from 'typescript';
import type { TransformerExtras } from 'ts-patch';
import * as metadataTransformerModule from '@clawject/core/transformer/metadata';

/** @public */
const transformer: (program: ts.Program, config: unknown, transformerExtras?: TransformerExtras) =>
  ts.TransformerFactory<ts.SourceFile> = metadataTransformerModule.default;

/** @public */
export const ClawjectMetadataTransformer: (programGetter: () => ts.Program) => ts.TransformerFactory<ts.SourceFile> = metadataTransformerModule.ClawjectMetadataTransformer;

/** @public */
export default transformer;
