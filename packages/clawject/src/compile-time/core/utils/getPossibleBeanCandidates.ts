import { Bean } from '../bean/Bean';
import { nameMatcher } from './nameMatcher';
import { DIType } from '../type-system/DIType';

export const getPossibleBeanCandidates = (
  propertyName: string,
  propertyType: DIType,
  contextBeans: Bean[]
): [byName: PossibleBeanCandidate[], byType: PossibleBeanCandidate[]] => {
  const propertyNameMatcher = nameMatcher(propertyName.toLowerCase());

  const candidatesByName: PossibleBeanCandidate[] = [];
  const candidatesByType: PossibleBeanCandidate[] = [];

  contextBeans.forEach(it => {
    if (propertyNameMatcher(it.classMemberName.toLowerCase())) {
      candidatesByName.push(new PossibleBeanCandidate(it));
    }

    if (propertyType.isCompatible(it.diType)) {
      candidatesByType.push(new PossibleBeanCandidate(it));
    }

    it.embeddedElements.forEach((embeddedElement, embeddedName) => {
      if (propertyNameMatcher(`${it.classMemberName.toLowerCase()}${embeddedName.toLowerCase()}`)) {
        candidatesByName.push(new PossibleBeanCandidate(it, embeddedName));
      }

      if (propertyType.isCompatible(embeddedElement)) {
        candidatesByType.push(new PossibleBeanCandidate(it, embeddedName));
      }
    });
  });

  return [candidatesByName, candidatesByType];
};

export class PossibleBeanCandidate {
  constructor(
    public bean: Bean,
    public embeddedName: string | null = null,
  ) {
  }
}
