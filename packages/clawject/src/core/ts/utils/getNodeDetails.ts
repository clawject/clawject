import ts from 'typescript';
import LineColumnFinder from 'line-column';
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
    text: string;
}

export const getNodeDetails = (node: ts.Node): NodeDetails => {
    const lineColumnFinder = LineColumnFinder(node.getSourceFile().text);

    const start: LineColumn = lineColumnFinder.fromIndex(node.getStart()) ?? { col: 0, line: 0 };
    const end: LineColumn = lineColumnFinder.fromIndex(node.getEnd()) ?? { col: 0, line: 0 };

    return {
        declarationName: getNameFromNodeOrNull(node),
        filePath: node.getSourceFile().fileName,
        start: start,
        end: end,
        startOffset: node.getStart(),
        endOffset: node.getEnd(),
        text: node.getText(),
    };
};
