import { csvToCompatibilityMatrix } from '../utils/csvToCompatibilityMatrix';
import { DecoratorKind } from './DecoratorKind';
import { DecoratorTarget } from './DecoratorTarget';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { ArgsCount } from './extractDecoratorMetadata';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { DecoratorParent } from './DecoratorParent';

export class DecoratorRules {
  private static wasInitialized = false;

  private static targetMatrix = new Map<DecoratorKind, Set<DecoratorTarget>>();

  private static parentMatrix = new Map<DecoratorKind, Set<DecoratorParent>>();

  private static compatibilityToOtherDecoratorsMatrix = new Map<DecoratorKind, Set<DecoratorKind>>();

  private static argumentsCountMatrix = new Map<DecoratorKind, ArgsCount | number>();
  private static argumentsStaticallyKnowingnessMatrix = new Map<DecoratorKind, boolean[]>();

  static init(): void {
    if (this.wasInitialized) {
      return;
    }

    this.targetMatrix = csvToCompatibilityMatrix<DecoratorKind, DecoratorTarget>(
      getCompilationContext().program.readFile?.(path.join(__dirname, 'csv/DecoratorTargets.csv')) ?? ''
    );
    this.parentMatrix = csvToCompatibilityMatrix<DecoratorKind, DecoratorParent>(
      getCompilationContext().program.readFile?.(path.join(__dirname, 'csv/DecoratorParents.csv')) ?? ''
    );
    this.compatibilityToOtherDecoratorsMatrix =  csvToCompatibilityMatrix<DecoratorKind, DecoratorKind>(
      getCompilationContext().program.readFile?.(path.join(__dirname, 'csv/DecoratorCompatibility.csv')) ?? ''
    );

    const fileContent = getCompilationContext().program.readFile?.(path.join(__dirname, 'csv/DecoratorArguments.csv')) ?? '';
    const values = parse(
      fileContent,
      {columns: true}
    ) as Record<string, string>[];
    const [
      countValues,
      staticallyKnowingnessValues
    ] = values;

    Object.entries(countValues).forEach(([key, value]) => {
      const split = value.split(',');

      if (split.length === 1) {
        this.argumentsCountMatrix.set(key as DecoratorKind, parseInt(value));
      } else {
        const [min, max] = split.map(it => parseInt(it));
        this.argumentsCountMatrix.set(key as DecoratorKind, {min, max});
      }
    });
    Object.entries(staticallyKnowingnessValues).forEach(([key, value]) => {
      const split = value.split(',').map(it => it === 'yes');
      this.argumentsStaticallyKnowingnessMatrix.set(key as DecoratorKind, split);
    });
    this.wasInitialized = true;
  }

  static getCompatibleTargets(decoratorKind: DecoratorKind): Set<DecoratorTarget> {
    const matrix = this.targetMatrix.get(decoratorKind);

    if (!matrix) {
      throw new Error(`No targets found for decorator ${decoratorKind}.`);
    }

    return matrix;
  }

  static getCompatibleParents(decoratorKind: DecoratorKind): Set<DecoratorParent> {
    const matrix = this.parentMatrix.get(decoratorKind);

    if (!matrix) {
      throw new Error(`No parens found for decorator ${decoratorKind}.`);
    }

    return matrix;
  }

  static isCompatibleWith(decoratorKind: DecoratorKind, otherDecoratorKind: DecoratorKind): boolean {
    const matrix = this.compatibilityToOtherDecoratorsMatrix.get(decoratorKind);

    if (!matrix) {
      throw new Error(`No compatible decorators found for decorator ${decoratorKind}.`);
    }

    return matrix.has(otherDecoratorKind) ?? false;
  }

  static getArgumentsCount(decoratorKind: DecoratorKind): ArgsCount | number {
    const argsCount = this.argumentsCountMatrix.get(decoratorKind);

    if (argsCount === undefined) {
      throw new Error(`No arguments count for decorator ${decoratorKind}.`);
    }

    return argsCount;
  }

  static getArgumentsStaticallyKnowingness(decoratorKind: DecoratorKind): boolean[] {
    const argsCount = this.argumentsStaticallyKnowingnessMatrix.get(decoratorKind);

    if (argsCount === undefined) {
      throw new Error(`No arguments statically knowingness for decorator ${decoratorKind}.`);
    }

    return argsCount;
  }
}
