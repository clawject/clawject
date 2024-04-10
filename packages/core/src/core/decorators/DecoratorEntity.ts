import type * as ts from 'typescript';
import { WeakNodeHolder } from '../WeakNodeHolder';
import { Decorator } from '../../api/decorators/Decorator';

export class DecoratorEntity extends WeakNodeHolder<ts.Decorator> {
  constructor(
    public readonly clawjectDecorator: Decorator,
    public readonly args: ts.Expression[],
    public readonly staticallyKnownArgs: unknown[],
    public readonly tsNode: ts.Decorator,
  ) {
    super(tsNode);
  }
}
