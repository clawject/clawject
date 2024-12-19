import { Bean } from '../bean/Bean';
import { nameMatcher } from './nameMatcher';
import { CType } from '../type-system/CType';

export const getPossibleBeanCandidates = (
  propertyType: CType,
  contextBeans: Bean[]
): Bean[] => {
  return contextBeans.filter(it => propertyType.isCompatible(it.cType));
};
