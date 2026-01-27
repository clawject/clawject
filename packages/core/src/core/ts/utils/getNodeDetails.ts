import type ts from 'typescript';
import { getNameFromNodeOrNull } from './getNameFromNodeOrNull';

export interface LineColumn {
  line: number;
  col: number;
}

export class NodeDetails {
  constructor(
    values: Partial<NodeDetails> = {}
  ) {
    Object.assign(this, values);
  }

  declare declarationName: string | null;
  declare filePath: string;
  declare start: LineColumn;
  declare end: LineColumn;
  declare startOffset: number;
  declare endOffset: number;
  declare length: number;
  declare text: string;
}

export const getNodeDetails = (node: ts.Node): NodeDetails => {
  const start = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
  const end = node.getSourceFile().getLineAndCharacterOfPosition(node.getEnd());

  return new NodeDetails({
    declarationName: getNameFromNodeOrNull(node),
    filePath: node.getSourceFile().fileName,
    start: lineAndCharacterToLineColumn(start),
    end: lineAndCharacterToLineColumn(end),
    startOffset: node.getStart(),
    endOffset: node.getEnd(),
    length: node.getEnd() - node.getStart(),
    text: node.getText(),
  });
};

function lineAndCharacterToLineColumn(lineAndCharacter: ts.LineAndCharacter): LineColumn {
  return {
    line: lineAndCharacter.line + 1,
    col: lineAndCharacter.character + 1,
  };
}
