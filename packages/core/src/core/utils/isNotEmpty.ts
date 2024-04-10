import { isEmpty } from 'lodash';

export const isNotEmpty = <T>(element: T): element is NonNullable<T> => !isEmpty(element);
