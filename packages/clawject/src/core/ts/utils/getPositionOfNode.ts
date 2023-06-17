import ts from 'typescript';
import LineColumn from 'line-column';

//TODO Start position and end position
export interface INodePosition {
    line: number;
    startColumn: number;
    endColumn: number;
    startOffset: number;
    endOffset: number;
}

export const getPositionOfNode = (node: ts.Node): INodePosition => {
    const sourceFileText = node.getSourceFile().text;
    const lengthBeforeNode = sourceFileText.slice(0, node.getStart()).length;
    const actualPosition = sourceFileText.slice(node.getStart()).search(/\S+/) + lengthBeforeNode;
    const columnFinder = LineColumn(sourceFileText);
    const result = columnFinder.fromIndex(actualPosition) ?? { col: 0, line: 0 };

    return {
        line: result.line,
        startColumn: result.col,
        endColumn: result.col + node.getWidth(),
        startOffset: node.getStart(),
        endOffset: node.getEnd()
    };
};
