export interface ICodeMessage {
  line: number;
  start: number;
  width: number;
  level: 'info' | 'warning' | 'error';
  message: string;
  relatedMessages: ICodeRelatedMessage[];
}

export interface ICodeRelatedMessage {
  link: string;
  highlightedPrefix?: string;
  message: string;
}

export interface Highlight {
  top: number;
  left: number;
  width: number;
  height: number;
  level: ICodeMessage['level'];
}
