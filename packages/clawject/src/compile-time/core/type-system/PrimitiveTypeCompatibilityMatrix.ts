import { DITypeFlag } from './DITypeFlag';
import { get } from 'lodash';

export class PrimitiveTypeCompatibilityMatrix {
  static [DITypeFlag.ANY]: Set<DITypeFlag> = new Set(Object.values(DITypeFlag).filter(it => typeof it === 'number') as any);
  static [DITypeFlag.UNKNOWN]: Set<DITypeFlag> = this[DITypeFlag.ANY];
  static [DITypeFlag.NEVER]: Set<DITypeFlag> = new Set([]);
  static [DITypeFlag.VOID]: Set<DITypeFlag> = new Set([DITypeFlag.ANY, DITypeFlag.UNDEFINED, DITypeFlag.NEVER]);
  static [DITypeFlag.UNDEFINED]: Set<DITypeFlag> = new Set([DITypeFlag.ANY, DITypeFlag.NEVER]);
  static [DITypeFlag.NULL]: Set<DITypeFlag> = new Set([DITypeFlag.ANY]);
  static [DITypeFlag.STRING]: Set<DITypeFlag> = new Set([DITypeFlag.STRING_LITERAL]);
  static [DITypeFlag.NUMBER]: Set<DITypeFlag> = new Set([DITypeFlag.NUMBER_LITERAL]);
  static [DITypeFlag.BOOLEAN]: Set<DITypeFlag> = new Set([DITypeFlag.BOOLEAN_LITERAL]);
  static [DITypeFlag.ENUM]: Set<DITypeFlag> = new Set([DITypeFlag.ENUM_LITERAL]);
  static [DITypeFlag.BIGINT]: Set<DITypeFlag> = new Set([DITypeFlag.BIGINT_LITERAL]);
  static [DITypeFlag.SYMBOL]: Set<DITypeFlag> = new Set([DITypeFlag.SYMBOL, DITypeFlag.UNIQUE_SYMBOL]);
  static [DITypeFlag.STRING_LITERAL]: Set<DITypeFlag> = new Set([]);
  static [DITypeFlag.NUMBER_LITERAL]: Set<DITypeFlag> = new Set([]);
  static [DITypeFlag.BOOLEAN_LITERAL]: Set<DITypeFlag> = new Set([]);
  static [DITypeFlag.ENUM_LITERAL]: Set<DITypeFlag> = new Set([]);
  static [DITypeFlag.BIGINT_LITERAL]: Set<DITypeFlag> = new Set([]);

  static isCompatible(from: DITypeFlag, to: DITypeFlag): boolean {
    if (from === to) {
      return true;
    }

    if (from === DITypeFlag.NEVER || to === DITypeFlag.NEVER) {
      return false;
    }

    return get(this, from, new Set<DITypeFlag>()).has(to);
  }
}
