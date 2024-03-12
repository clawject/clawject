export interface ICodeMessage {
  line: number;
  start: number;
  width: number;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface Highlight {
  top: number;
  left: number;
  width: number;
  height: number;
  level: ICodeMessage['level'];
}
