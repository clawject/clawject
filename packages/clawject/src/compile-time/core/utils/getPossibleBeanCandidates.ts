import { Bean } from '../bean/Bean';
import { nameMatcher } from './nameMatcher';
import { DIType } from '../type-system/DIType';

export const getPossibleBeanCandidates = (
  propertyName: string,
  propertyType: DIType,
  contextBeans: Bean[]
): [byName: Bean[], byType: Bean[]] => {
  const propertyNameMatcher = nameMatcher(propertyName.toLowerCase());

  const candidatesByName: Bean[] = [];
  const candidatesByType: Bean[] = [];

  contextBeans.forEach(it => {
    if (propertyType.isCompatible(it.diType)) {
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
