import { Bean } from '../bean/Bean';
import { nameMatcher } from './nameMatcher';
import { CType } from '../type-system/CType';

export const getPossibleBeanCandidates = (
  propertyName: string,
  propertyType: CType,
  contextBeans: Set<Bean>
): [byName: Set<Bean>, byType: Set<Bean>] => {
  const propertyNameMatcher = nameMatcher(propertyName.toLowerCase());

  const candidatesByName = new Set<Bean>();
  const candidatesByType = new Set<Bean>();

  contextBeans.forEach(it => {
    if (propertyType.isCompatible(it.cType)) {
      candidatesByType.add(it);
      return;
    }

    if (propertyNameMatcher(it.fullName.toLowerCase())) {
      candidatesByName.add(it);
      return;
    }
  });

  return [candidatesByName, candidatesByType];
};
