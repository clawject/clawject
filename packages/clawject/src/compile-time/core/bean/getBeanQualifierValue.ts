import { Bean } from './Bean';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { unquoteString } from '../utils/unquoteString';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { Context } from '../../compilation-context/Context';

export const getBeanQualifierValue = (bean: Bean): string | null => {
  const qualifierDecoratorMetadata = extractDecoratorMetadata(bean.node, DecoratorKind.Qualifier);

  if (qualifierDecoratorMetadata === null) {
    return null;
  }

  const qualifierValue = qualifierDecoratorMetadata.args[0];

  if (!Context.ts.isStringLiteral(qualifierValue)) {
    //Just returning null here, because the decorator is invalid
    return null;
  }

  const qualifierValueText = unquoteString(qualifierValue.getText());

  if (!qualifierValueText) {
    Context.report(new IncorrectNameError(
      'Qualifier can not be empty.',
      qualifierValue,
      null,
      null,
    ));
    return null;
  }

  return unquoteString(qualifierValue.getText());
};
