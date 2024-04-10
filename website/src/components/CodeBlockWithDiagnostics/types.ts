import { Props as OriginalCodeBlockProps } from '@theme/CodeBlock';

export interface CodeBlockProps extends OriginalCodeBlockProps {
  diagnostics?: ICodeDiagnostic[];
}

export interface ICodeDiagnostic {
  line: number;
  start: number;
  width: number;
  highlightedRangeClassName?: string;
  message?: string;
  relatedDiagnostics: ICodeRelatedDiagnostic[];
}

export interface ICodeRelatedDiagnostic {
  link: string;
  highlightedPrefix?: string;
  message: string;
}
