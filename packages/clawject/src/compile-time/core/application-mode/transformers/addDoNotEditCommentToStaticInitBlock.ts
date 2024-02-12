import ts from 'typescript';

export const addDoNotEditCommentToStaticInitBlock = <T extends ts.Node> (node: T): T => {
  return ts.addSyntheticLeadingComment(
    node,
    ts.SyntaxKind.MultiLineCommentTrivia,
    '* The content of this static initialization block is auto-generated, editing it could lead to unexpected behavior.',
    true
  );
};
