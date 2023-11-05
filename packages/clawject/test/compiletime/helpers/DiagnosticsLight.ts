export interface DiagnosticsLight {
  messageText: string;
  start: number;
  file: {
    fileName: string;
  };
  relatedInformation?: {
    messageText: string;
    start: number;
    file: {
      fileName: string;
    };
  }[]
}
