import tsServer, { DiagnosticCategory } from 'typescript/lib/tsserverlibrary';
import { MessageType } from '../compile-time/compilation-context/messages/MessageType';
import { NodeDetails } from '../compile-time/core/ts/utils/getNodeDetails';
import { CircularDependenciesError } from '../compile-time/compilation-context/messages/errors/CircularDependenciesError';
import { mapFilter } from '../compile-time/core/utils/mapFilter';
import { AbstractCompilationMessage, IRelatedConfigurationMetadata } from '../compile-time/compilation-context/messages/AbstractCompilationMessage';
import { CanNotRegisterBeanError } from '../compile-time/compilation-context/messages/errors/CanNotRegisterBeanError';
import { getCompilationContext } from '../transformer/getCompilationContext';
import { MissingBeansDeclaration } from '../compile-time/compilation-context/messages/errors/MissingBeansDeclaration';
import { BeanCandidateNotFoundError } from '../compile-time/compilation-context/messages/errors/BeanCandidateNotFoundError';

const MESSAGES_WITHOUT_CONTEXT_DETAILS = [
  CircularDependenciesError,
  CanNotRegisterBeanError,
  MissingBeansDeclaration,
];

export class LanguageServiceReportBuilder {
  static buildSemanticDiagnostics(info: tsServer.server.PluginCreateInfo, fileName: string): tsServer.Diagnostic[] {
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
  ): tsServer.Diagnostic | null {
    const diagnosticCategory = this.getDiagnosticCategory(message);

    let messageDescription = message.description ?? '';
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
          messageText: `Bean '${it.beanName}' is declared here.`,
          category: this.getDiagnosticCategory(message),
        });

        return it.beanName;
      }).join(' -> ');
    }

    if (message instanceof CanNotRegisterBeanError) {
      const causes: tsServer.DiagnosticRelatedInformation[] = message.missingCandidates.map(it => ({
        messageText: `Can not find Bean candidate for '${it.name}'`,
        start: it.nodeDetails.startOffset,
        length: it.nodeDetails.length,
        code: 0,
        file: info.languageService.getProgram()?.getSourceFile(it.nodeDetails.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...causes);
    }

    if (message instanceof BeanCandidateNotFoundError) {
      messageDescription = '';

      const candidatesByType: tsServer.DiagnosticRelatedInformation[] = message.candidatesByType.map(it => ({
        messageText: `bean '${it.declarationName ?? '<anonymous>'}' matched by type.`,
        start: it.startOffset,
        length: it.length,
        code: 0,
        file: info.languageService.getProgram()?.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      const candidatesByName: tsServer.DiagnosticRelatedInformation[] = message.candidatesByName.map(it => ({
        messageText: `bean '${it.declarationName ?? '<anonymous>'}' matched by name.`,
        start: it.startOffset,
        length: it.length,
        code: 0,
        file: info.languageService.getProgram()?.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...candidatesByType, ...candidatesByName);
    }

    if (message instanceof MissingBeansDeclaration) {
      const missingElementsRelatedInformation: tsServer.DiagnosticRelatedInformation[] = message.missingElementsLocations.map(it => ({
        messageText: `'${it.name}' is declared here.`,
        start: it.nodeDetails.startOffset,
        length: it.nodeDetails.length,
        code: 0,
        file: info.languageService.getProgram()?.getSourceFile(it.nodeDetails.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...missingElementsRelatedInformation);
    }

    if (message.relatedConfigurationMetadata !== null && MESSAGES_WITHOUT_CONTEXT_DETAILS.every(it => !(message instanceof it))) {
      relatedInformation.push(
        this.buildRelatedDiagnosticsFromRelatedConfigurationMetadata(info, message.relatedConfigurationMetadata)
      );
    }

    return {
      messageText: `${messageDescription} ${messageDetails}`.trim(),
      start: nodeDetails.startOffset,
      length: nodeDetails.length,
      code: 0,
      file: info.languageService.getProgram()?.getSourceFile(fileName),
      category: diagnosticCategory,
      source: message.code,
      relatedInformation: relatedInformation,
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
  ): tsServer.DiagnosticRelatedInformation {
    const nodeDetails = relatedConfigurationMetadata.nameNodeDetails ?? relatedConfigurationMetadata.nodeDetails;

    return {
      messageText: `related context: '${relatedConfigurationMetadata.name}'`,
      length: nodeDetails.length,
      start: nodeDetails.startOffset,
      file: info.languageService.getProgram()?.getSourceFile(relatedConfigurationMetadata.fileName),
      category: DiagnosticCategory.Message,
      code: 0,
    };
  }
}
