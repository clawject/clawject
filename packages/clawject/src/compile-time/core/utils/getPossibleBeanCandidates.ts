import { Bean } from '../bean/Bean';
import { nameMatcher } from './nameMatcher';
import { CType } from '../type-system/CType';

export const getPossibleBeanCandidates = (
  propertyName: string,
  propertyType: CType,
  contextBeans: Bean[]
): [byName: Bean[], byType: Bean[]] => {
  const propertyNameMatcher = nameMatcher(propertyName.toLowerCase());

  const candidatesByName: Bean[] = [];
  const candidatesByType: Bean[] = [];

  contextBeans.forEach(it => {
    if (propertyType.isCompatible(it.cType)) {
      candidatesByType.push(it);
      return;
    }

    if (propertyNameMatcher(it.fullName.toLowerCase())) {
      candidatesByName.push(it);
      return;
    }
  });

  return [candidatesByName, candidatesByType];
};
