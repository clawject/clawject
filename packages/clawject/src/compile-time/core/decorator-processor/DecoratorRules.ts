import { csvToCompatibilityMatrix } from '../utils/csvToCompatibilityMatrix';
import { DecoratorKind } from './DecoratorKind';
import { DecoratorTarget } from './DecoratorTarget';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { ArgsCount } from './extractDecoratorMetadata';

export class DecoratorRules {
  private static targetMatrix = csvToCompatibilityMatrix<DecoratorKind, DecoratorTarget>(
    fs.readFileSync(path.join(__dirname, 'csv/DecoratorTargets.csv'), 'utf8')
  );

  private static compatibilityToOtherDecoratorsMatrix = csvToCompatibilityMatrix<DecoratorKind, DecoratorKind>(
    fs.readFileSync(path.join(__dirname, 'csv/DecoratorCompatibility.csv'), 'utf8')
  );

  private static declare argumentsCountMatrix: Map<DecoratorKind, ArgsCount | number>;

  static {
    this.argumentsCountMatrix = new Map<DecoratorKind, ArgsCount | number>();
    const values = parse(
      fs.readFileSync(path.join(__dirname, 'csv/DecoratorArguments.csv'), 'utf8'),
      {columns: true}
    )[0] as Record<string, string>;

    Object.entries(values).forEach(([key, value]) => {
      const split = value.split(',');

      if (split.length === 1) {
        this.argumentsCountMatrix.set(key as DecoratorKind, parseInt(value));
      } else {
        const [min, max] = split.map(it => parseInt(it));
        this.argumentsCountMatrix.set(key as DecoratorKind, {min, max});
      }
    });
  }

  static isCompatibleTarget(decoratorKind: DecoratorKind, target: DecoratorTarget): boolean {
    const matrix = this.targetMatrix.get(decoratorKind);

    if (!matrix) {
      throw new Error(`No targets found for decorator ${decoratorKind}.`);
    }

    return matrix.has(target);
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
}
