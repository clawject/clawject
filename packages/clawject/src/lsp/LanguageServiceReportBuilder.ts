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
import { BeanKind } from '../compile-time/core/bean/BeanKind';
import { DuplicateNameError } from '../compile-time/compilation-context/messages/errors/DuplicateNameError';

const MESSAGES_WITHOUT_CONTEXT_DETAILS = [
  CircularDependenciesError,
  CanNotRegisterBeanError,
  MissingBeansDeclaration,
  BeanCandidateNotFoundError,
  DuplicateNameError,
];

export class LanguageServiceReportBuilder {
  private static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  static buildSemanticDiagnostics(fileName: string): tsServer.Diagnostic[] {
    const pluginInfo = this.pluginInfo;

    if (!pluginInfo) {
      return [];
    }

    return mapFilter(
      getCompilationContext().getMessagesByFileName(fileName),
      it => this.getFormattedDiagnostics(it, fileName),
      (it): it is tsServer.Diagnostic => it !== null,
    );
  }

  private static getFormattedDiagnostics(
    message: AbstractCompilationMessage,
    fileName: string,
  ): tsServer.Diagnostic | null {
    const pluginInfo = this.pluginInfo;

    if (!pluginInfo) {
      return null;
    }

    const diagnosticCategory = this.getDiagnosticCategory(message);

    let messageDescription = message.description ?? '';
    let messageDetails = message.details ?? '';
    const nodeDetails: NodeDetails = message.place;
    const relatedInformation: tsServer.DiagnosticRelatedInformation[] = [];

    if (message instanceof CircularDependenciesError) {
      message.cycleMembers.filter(it => !it.isTarget).forEach(it => {
        relatedInformation.push({
          length: it.nodeDetails.length,
          file: this.getSourceFile(it.nodeDetails.filePath),
          start: it.nodeDetails.startOffset,
          code: 0,
          messageText: `'${it.beanName}' is declared here.`,
          category: this.getDiagnosticCategory(message),
        });

        return it.beanName;
      });

      messageDetails = message.cycleMembers
        .map(it => it.beanName)
        .join(' -> ');
    }

    if (message instanceof CanNotRegisterBeanError) {
      const causes: tsServer.DiagnosticRelatedInformation[] = message.missingCandidates.map(it => ({
        messageText: `Can not find Bean candidate for '${it.name}'.`,
        start: it.nodeDetails.startOffset,
        length: it.nodeDetails.length,
        code: 0,
        file: this.getSourceFile(it.nodeDetails.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...causes);
    }

    if (message instanceof BeanCandidateNotFoundError) {
      messageDescription = '';

      const candidatesByType: tsServer.DiagnosticRelatedInformation[] = message.candidatesByType.map(it => ({
        messageText: `'${it.declarationName ?? '<anonymous>'}' matched by type.`,
        start: it.startOffset,
        length: it.length,
        code: 0,
        file: this.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      const candidatesByName: tsServer.DiagnosticRelatedInformation[] = message.candidatesByName.map(it => ({
        messageText: `'${it.declarationName ?? '<anonymous>'}' matched by name.`,
        start: it.startOffset,
        length: it.length,
        code: 0,
        file: this.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...candidatesByType, ...candidatesByName);

      if (message.beanKind === BeanKind.CLASS_CONSTRUCTOR) {
        relatedInformation.push({
          messageText: `'${message.beanDeclarationNodeDetails.declarationName}' is declared here.`,
          start: message.beanDeclarationNodeDetails.startOffset,
          length: message.beanDeclarationNodeDetails.length,
          code: 0,
          file: this.getSourceFile(message.beanDeclarationNodeDetails?.filePath),
          category: this.getDiagnosticCategory(message),
        });
      }
    }

    if (message instanceof MissingBeansDeclaration) {
      const missingElementsRelatedInformation: tsServer.DiagnosticRelatedInformation[] = message.missingElementsLocations.map(it => ({
        messageText: `'${it.name}' is declared here.`,
        start: it.nodeDetails.startOffset,
        length: it.nodeDetails.length,
        code: 0,
        file: pluginInfo.languageService.getProgram()?.getSourceFile(it.nodeDetails.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...missingElementsRelatedInformation);
    }

    if (message instanceof DuplicateNameError) {
      const duplicateNamesRelatedInformation: tsServer.DiagnosticRelatedInformation[] = message.duplicateElements.map(it => ({
        messageText: `'${it.name}' is declared here.`,
        start: it.location.startOffset,
        length: it.location.length,
        code: 0,
        file: pluginInfo.languageService.getProgram()?.getSourceFile(it.location.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...duplicateNamesRelatedInformation);
    }

    if (message.relatedConfigurationMetadata !== null && MESSAGES_WITHOUT_CONTEXT_DETAILS.every(it => !(message instanceof it))) {
      relatedInformation.push(
        this.buildRelatedDiagnosticsFromRelatedConfigurationMetadata(message.relatedConfigurationMetadata)
      );
    }

    return {
      messageText: `${messageDescription} ${messageDetails}`.trim(),
      start: nodeDetails.startOffset,
      length: nodeDetails.length,
      code: 0,
      file: this.getSourceFile(fileName),
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

  private static buildRelatedDiagnosticsFromRelatedConfigurationMetadata(relatedConfigurationMetadata: IRelatedConfigurationMetadata): tsServer.DiagnosticRelatedInformation {
    const nodeDetails = relatedConfigurationMetadata.nameNodeDetails ?? relatedConfigurationMetadata.nodeDetails;

    return {
      messageText: `'${relatedConfigurationMetadata.name}' is declared here.`,
      length: nodeDetails.length,
      start: nodeDetails.startOffset,
      file: this.getSourceFile(relatedConfigurationMetadata.fileName),
      category: DiagnosticCategory.Message,
      code: 0,
    };
  }

  private static getSourceFile(fileName: string | undefined | null): tsServer.SourceFile | undefined {
    const pluginInfo = this.pluginInfo;

    if (!fileName || !pluginInfo) {
      return undefined;
    }

    return pluginInfo.languageService.getProgram()?.getSourceFile(fileName);
  }
}
