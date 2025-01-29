import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';

export enum DoNotEditElement {
  STATIC_INIT_BLOCK = 'STATIC_INIT_BLOCK',
  FIELD = 'FIELD',
}

export const addDoNotEditComment = <T extends ts.Node> (node: T, element: DoNotEditElement): T => {
  let message = '';

  switch (element) {
  case DoNotEditElement.STATIC_INIT_BLOCK:
    message = 'The content of this static initialization block is auto-generated, editing it could lead to unexpected behavior.';
    break;
  case DoNotEditElement.FIELD:
    message = 'This field is auto-generated, editing it could lead to unexpected behavior.';
    break;
  }

  return Context.ts.addSyntheticLeadingComment(
    node,
    Context.ts.SyntaxKind.MultiLineCommentTrivia,
    `* ${message}`,
    true
  );
};
