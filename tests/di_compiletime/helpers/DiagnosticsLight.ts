export interface DiagnosticsLight {
  messageText: string | unknown;
  start: number | undefined;
  file: {
    fileName: string | undefined;
  };
  relatedInformation?: {
    messageText: string | unknown;
    start: number | undefined;
    file: {
      fileName: string | undefined;
    };
  }[]
}
