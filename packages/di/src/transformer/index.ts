import type ts from 'typescript';
import type { TransformerExtras } from 'ts-patch';
import * as transformerModule from '@clawject/core/transformer';

/** @public */
const transformer: (program: ts.Program, config: unknown, transformerExtras?: TransformerExtras) =>
  ts.TransformerFactory<ts.SourceFile> = transformerModule.default;

/** @public */
export const ClawjectTransformer: (programGetter: () => ts.Program) => ts.TransformerFactory<ts.SourceFile> = transformerModule.ClawjectTransformer;

/** @public */
export default transformer;
