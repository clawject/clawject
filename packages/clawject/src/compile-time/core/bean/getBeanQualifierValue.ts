import { Bean } from './Bean';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import ts from 'typescript';
import { unquoteString } from '../utils/unquoteString';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';

export const getBeanQualifierValue = (bean: Bean): string | null => {
  const qualifierDecoratorMetadata = extractDecoratorMetadata(bean.node, DecoratorKind.Qualifier);

  if (qualifierDecoratorMetadata === null) {
    return null;
  }

  const qualifierValue = qualifierDecoratorMetadata.args[0];

  if (!ts.isStringLiteral(qualifierValue)) {
    //Just returning null here, because the decorator is invalid
    return null;
  }

  const qualifierValueText = unquoteString(qualifierValue.getText());

  if (!qualifierValueText) {
    getCompilationContext().report(new IncorrectNameError(
      'Qualifier can not be empty.',
      qualifierValue,
      null,
    ));
    return null;
  }

  return unquoteString(qualifierValue.getText());
};
