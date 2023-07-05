import { Bean } from '../bean/Bean';
import { nameMatcher } from './nameMatcher';
import { DIType } from '../type-system/DIType';

export const getPossibleBeanCandidates = (
    propertyName: string,
    propertyType: DIType,
    contextBeans: Bean[]
): [byName: Bean[], byType: Bean[]] => {
    const propertyNameMatcher = nameMatcher(propertyName.toLowerCase());
    const candidatesByName = contextBeans.filter(it => {
        return propertyNameMatcher(it.classMemberName.toLowerCase() + it.nestedProperty?.toLowerCase() ?? '');
    });
    const candidatesByType = contextBeans.filter(it => {
        return propertyType.isCompatible(it.diType);
    });

    return [candidatesByName, candidatesByType];
};
