import ts from 'typescript';
import { getNameFromNodeOrNull } from './getNameFromNodeOrNull';

export interface LineColumn {
  line: number;
  col: number;
}

export interface NodeDetails {
  declarationName: string | null;
  filePath: string;
  start: LineColumn;
  end: LineColumn;
  startOffset: number;
  endOffset: number;
  length: number;
  text: string;
}

export const getNodeDetails = (node: ts.Node): NodeDetails => {
  const start = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
  const end = node.getSourceFile().getLineAndCharacterOfPosition(node.getEnd());

  return {
    declarationName: getNameFromNodeOrNull(node),
    filePath: node.getSourceFile().fileName,
    start: lineAndCharacterToLineColumn(start),
    end: lineAndCharacterToLineColumn(end),
    startOffset: node.getStart(),
    endOffset: node.getEnd(),
    length: node.getEnd() - node.getStart(),
    text: node.getText(),
  };
};

function lineAndCharacterToLineColumn(lineAndCharacter: ts.LineAndCharacter): LineColumn {
  return {
    line: lineAndCharacter.line + 1,
    col: lineAndCharacter.character + 1,
  };
}
