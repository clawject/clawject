import tsServer, { DiagnosticCategory } from 'typescript/lib/tsserverlibrary';
import { MessageType } from '../compile-time/compilation-context/messages/MessageType';
import { NodeDetails } from '../compile-time/core/ts/utils/getNodeDetails';
import { CircularDependenciesError } from '../compile-time/compilation-context/messages/errors/CircularDependenciesError';
import { mapFilter } from '../compile-time/core/utils/mapFilter';
import { AbstractCompilationMessage, IRelatedConfigurationMetadata } from '../compile-time/compilation-context/messages/AbstractCompilationMessage';
import { CanNotRegisterBeanError } from '../compile-time/compilation-context/messages/errors/CanNotRegisterBeanError';
import { getCompilationContext } from '../transformer/getCompilationContext';

export interface ClawjectDiagnostics extends tsServer.Diagnostic {
  ___clawjectToken?: any;
}

export interface ClawjectDiagnosticRelatedInformation extends tsServer.DiagnosticRelatedInformation {
  ___clawjectToken?: any;
}

export class LanguageServiceReportBuilder {
  static buildSemanticDiagnostics(info: tsServer.server.PluginCreateInfo, fileName: string): ClawjectDiagnostics[] {
    return mapFilter(
      getCompilationContext().getMessagesByFileName(fileName),
      it => this.getFormattedDiagnostics(info, it, fileName),
      (it): it is tsServer.Diagnostic => it !== null,
    );
  }

  private static getFormattedDiagnostics(
    info: tsServer.server.PluginCreateInfo,
    message: AbstractCompilationMessage,
    fileName: string,
  ): ClawjectDiagnostics | null {
    const diagnosticCategory = this.getDiagnosticCategory(message);

    let messageDetails = message.details ?? '';
    const nodeDetails: NodeDetails = message.place;
    const relatedInformation: tsServer.DiagnosticRelatedInformation[] = [];

    if (message instanceof CircularDependenciesError) {
      messageDetails = message.cycleMembers.map(it => {
        relatedInformation.push({
          length: it.nodeDetails.length,
          file: info.languageService.getProgram()?.getSourceFile(it.nodeDetails.filePath),
          start: it.nodeDetails.startOffset,
          code: 0,
          messageText: `Bean: ${it.beanName}`,
          category: DiagnosticCategory.Error,
        });

        return it.beanName;
      }).join(' -> ');
    }

    if (message instanceof CanNotRegisterBeanError) {
      const causes: ClawjectDiagnosticRelatedInformation[] = message.causes.map(it => ({
        messageText: `${it.description} ${it.details ?? ''}`.trim(),
        start: it.place.startOffset,
        length: it.place.length,
        code: 0,
        file: info.languageService.getProgram()?.getSourceFile(it.place.filePath),
        category: this.getDiagnosticCategory(it),
        ___clawjectToken: undefined,
      }));

      relatedInformation.push(...causes);
    }

    if (message.relatedConfigurationMetadata !== null) {
      relatedInformation.push(
        this.buildRelatedDiagnosticsFromRelatedConfigurationMetadata(info, message.relatedConfigurationMetadata)
      );
    }

    return {
      messageText: `${message.description} ${messageDetails}`.trim(),
      start: nodeDetails.startOffset,
      length: nodeDetails.length,
      code: 0,
      file: info.languageService.getProgram()?.getSourceFile(fileName),
      category: diagnosticCategory,
      source: message.code,
      relatedInformation: relatedInformation,
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

  private static buildRelatedDiagnosticsFromRelatedConfigurationMetadata(
    info: tsServer.server.PluginCreateInfo,
    relatedConfigurationMetadata: IRelatedConfigurationMetadata
  ): ClawjectDiagnosticRelatedInformation {
    const nodeDetails = relatedConfigurationMetadata.nameNodeDetails ?? relatedConfigurationMetadata.nodeDetails;

    return {
      messageText: `Related context: ${relatedConfigurationMetadata.name}`,
      length: nodeDetails.length,
      start: nodeDetails.startOffset,
      file: info.languageService.getProgram()?.getSourceFile(relatedConfigurationMetadata.fileName),
      category: DiagnosticCategory.Message,
      code: 0,
      ___clawjectToken: undefined,
    };
  }
}
