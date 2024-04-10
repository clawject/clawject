export class DecoratorArgument {
  constructor(
    public constraint: DecoratorArgumentConstraint,
    public value: unknown,
  ) {}
}

export interface DecoratorArgumentConstraint {
  optional: boolean;
  staticallyKnown: boolean;
}

export interface ClawjectDecoratorArgumentError {
  error: string;
  index: number;
}
