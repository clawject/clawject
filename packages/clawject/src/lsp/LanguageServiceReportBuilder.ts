import tsServer, { DiagnosticCategory } from 'typescript/lib/tsserverlibrary';
import { MessageType } from '../compile-time/compilation-context/messages/MessageType';
import { NodeDetails } from '../compile-time/core/ts/utils/getNodeDetails';
import { CircularDependenciesError } from '../compile-time/compilation-context/messages/errors/CircularDependenciesError';
import { mapFilter } from '../compile-time/core/utils/mapFilter';
import { AbstractCompilationMessage } from '../compile-time/compilation-context/messages/AbstractCompilationMessage';

export interface ClawjectDiagnostics extends tsServer.Diagnostic {
  ___clawjectToken?: any;
}

export class LanguageServiceReportBuilder {
  static buildSemanticDiagnostics(info: tsServer.server.PluginCreateInfo, messages: AbstractCompilationMessage[], fileName: string): ClawjectDiagnostics[] {
    return mapFilter(
      messages,
      it => this.getFormattedDiagnostics(info, it, fileName),
      (it): it is tsServer.Diagnostic => it !== null,
    );
  }

  private static getFormattedDiagnostics(
    info: tsServer.server.PluginCreateInfo,
    message: AbstractCompilationMessage,
    fileName: string,
  ): ClawjectDiagnostics | null {
    if (message.place.filePath !== fileName) {
      return null;
    }

    const diagnosticCategory = this.getDiagnosticCategory(message);

    let messageDetails = message.details ?? '';
    const nodeDetails: NodeDetails = message.place;

    if (message instanceof CircularDependenciesError) {
      messageDetails = message.cycleMembers.map(it => it.beanName).join(' <-> ');
    }

    return {
      messageText: `${message.description} ${messageDetails}`.trim(),
      start: nodeDetails.startOffset,
      length: nodeDetails.length,
      code: 0,
      file: info.languageService.getProgram()?.getSourceFile(fileName),
      category: diagnosticCategory,
      source: message.code,
      ___clawjectToken: undefined,
    };
  }

  private static getDiagnosticCategory(message: AbstractCompilationMessage): tsServer.DiagnosticCategory {
    switch (message.type) {
    case MessageType.INFO:
      return DiagnosticCategory.Message;
    case MessageType.WARNING:
      return DiagnosticCategory.Warning;
    case MessageType.ERROR:
      return DiagnosticCategory.Error;
    }
  }
}
