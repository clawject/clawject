import type * as ts from 'typescript';
import { AbstractCompilationMessage, IRelatedConfigurationOrApplicationMetadata } from '../compilation-context/messages/AbstractCompilationMessage';
import { NodeDetails } from '../core/ts/utils/getNodeDetails';
import { CircularDependenciesError } from '../compilation-context/messages/errors/CircularDependenciesError';
import { CanNotRegisterBeanError } from '../compilation-context/messages/errors/CanNotRegisterBeanError';
import { BeanCandidateNotFoundError } from '../compilation-context/messages/errors/BeanCandidateNotFoundError';
import { BeanKind } from '../core/bean/BeanKind';
import { DuplicateNameError } from '../compilation-context/messages/errors/DuplicateNameError';
import { MessageType } from '../compilation-context/messages/MessageType';
import { ConfigurationAlreadyImportedInfo } from '../compilation-context/messages/infos/ConfigurationAlreadyImportedInfo';
import { BeanExposingError } from '../compilation-context/messages/errors/BeanExposingError';
import { Context } from '../compilation-context/Context';
import { compact } from 'lodash';

export class DiagnosticsBuilder {
  private static formatDiagnosticsHost: ts.FormatDiagnosticsHost = {
    getCurrentDirectory: () => Context.program.getCurrentDirectory(),
    getCanonicalFileName: (fileName) => Context.program.getCanonicalFileName(fileName),
    getNewLine: () => Context.ts.sys.newLine,
  };

  static diagnosticsToString(diagnostics: ts.Diagnostic[]): string {
    return Context.ts.formatDiagnosticsWithColorAndContext(diagnostics, this.formatDiagnosticsHost);
  }

  static getDiagnostics(fileName?: string): ts.Diagnostic[] {
    let messages = Context.getAllMessages();

    if (fileName) {
      messages = messages.filter(it => it.place.filePath === fileName);
    }

    return compact(messages
      .map(it => this.compilationMessageToDiagnostic(it)));
  }

  static compilationMessageToDiagnostic(message: AbstractCompilationMessage): ts.Diagnostic | null {
    if (message.type === MessageType.INFO && !Context.languageServiceMode) {
      return null;
    }

    const diagnosticCategory = this.getDiagnosticCategory(message);
    const diagnosticsCode = this.getDiagnosticCode(message);

    let messageDescription = message.description ?? '';
    let messageDetails = message.details ?? '';
    const nodeDetails: NodeDetails = message.place;
    const relatedInformation: ts.DiagnosticRelatedInformation[] = [];

    if (message instanceof CircularDependenciesError) {
      message.cycleMembers.slice(1).forEach(it => {
        relatedInformation.push({
          length: it.nodeDetails.length,
          file: this.getSourceFile(it.nodeDetails.filePath),
          start: it.nodeDetails.startOffset,
          code: diagnosticsCode,
          messageText: `'${it.beanName}' is declared here.`,
          category: this.getDiagnosticCategory(message),
        });
      });

      if (Context.languageServiceMode) {
        const firstMember = message.cycleMembers[0];
        messageDetails = [...message.cycleMembers, firstMember].map(it => it.beanName)
          .join(' → ');
      } else {
        messageDetails = '\n' + message.cyclePresentation();
      }
    }

    if (message instanceof CanNotRegisterBeanError) {
      const causes: ts.DiagnosticRelatedInformation[] = message.missingCandidates.map(it => ({
        messageText: `Cannot find a Bean candidate for '${it.name}'.`,
        start: it.nodeDetails.startOffset,
        length: it.nodeDetails.length,
        code: diagnosticsCode,
        file: this.getSourceFile(it.nodeDetails.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...causes);
    }

    if (message instanceof BeanCandidateNotFoundError) {
      messageDescription = 'Could not qualify bean candidate.';

      const candidatesByType: ts.DiagnosticRelatedInformation[] = message.candidatesByType.map(it => ({
        messageText: `'${it.declarationName ?? '<anonymous>'}' matched by type.`,
        start: it.startOffset,
        length: it.length,
        code: diagnosticsCode,
        file: this.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...candidatesByType);

      if (message.beanKind === BeanKind.CLASS_CONSTRUCTOR && message.beanDeclarationNodeDetails !== null) {
        relatedInformation.push({
          messageText: `'${message.beanDeclarationNodeDetails.declarationName}' is declared here.`,
          start: message.beanDeclarationNodeDetails.startOffset,
          length: message.beanDeclarationNodeDetails.length,
          code: diagnosticsCode,
          file: this.getSourceFile(message.beanDeclarationNodeDetails?.filePath),
          category: this.getDiagnosticCategory(message),
        });
      }
    }

    if (message instanceof DuplicateNameError) {
      const duplicateNamesRelatedInformation: ts.DiagnosticRelatedInformation[] = message.duplicateElements.map(it => ({
        messageText: `'${it.name}' is declared here.`,
        start: it.location.startOffset,
        length: it.location.length,
        code: diagnosticsCode,
        file: this.getSourceFile(it.location.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...duplicateNamesRelatedInformation);
    }

    if (message instanceof ConfigurationAlreadyImportedInfo) {
      const duplicateImportsRelatedInformation: ts.DiagnosticRelatedInformation[] = message.relatedImportsDetails.map(it => ({
        messageText: `'${it.declarationName}' is declared here.`,
        start: it.startOffset,
        length: it.length,
        code: diagnosticsCode,
        file: this.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...duplicateImportsRelatedInformation);
    }

    if (message instanceof BeanExposingError) {
      const missingElementsRelatedInformation: ts.DiagnosticRelatedInformation[] = message.problemNodes.map(it => ({
        messageText: `'${it.declarationName}' is declared here.`,
        start: it.startOffset,
        length: it.length,
        code: diagnosticsCode,
        file: this.getSourceFile(it.filePath),
        category: this.getDiagnosticCategory(message),
      }));

      relatedInformation.push(...missingElementsRelatedInformation);
    }

    if (message.relatedConfigurationMetadata !== null) {
      relatedInformation.push(
        this.buildRelatedDiagnosticsFromRelatedConfigurationMetadata(message.relatedConfigurationMetadata)
      );
    }

    if (message.relatedApplicationMetadata !== null) {
      relatedInformation.push(
        this.buildRelatedDiagnosticsFromRelatedConfigurationMetadata(message.relatedApplicationMetadata)
      );
    }

    return {
      messageText: `${messageDescription} ${messageDetails}`.trim(),
      start: nodeDetails.startOffset,
      length: nodeDetails.length,
      code: diagnosticsCode,
      file: this.getSourceFile(nodeDetails.filePath),
      category: diagnosticCategory,
      source: message.code,
      relatedInformation: relatedInformation,
    };
  }

  private static getDiagnosticCategory(message: AbstractCompilationMessage): ts.DiagnosticCategory {
    switch (message.type) {
    case MessageType.INFO:
      return Context.ts.DiagnosticCategory.Suggestion;
    case MessageType.WARNING:
      return Context.ts.DiagnosticCategory.Warning;
    case MessageType.ERROR:
      return Context.ts.DiagnosticCategory.Error;
    }
  }

  private static buildRelatedDiagnosticsFromRelatedConfigurationMetadata(relatedConfigurationMetadata: IRelatedConfigurationOrApplicationMetadata): ts.DiagnosticRelatedInformation {
    const nodeDetails = relatedConfigurationMetadata.nameNodeDetails ?? relatedConfigurationMetadata.nodeDetails;

    return {
      messageText: `'${relatedConfigurationMetadata.name}' is declared here.`,
      length: nodeDetails.length,
      start: nodeDetails.startOffset,
      file: this.getSourceFile(relatedConfigurationMetadata.fileName),
      category: Context.ts.DiagnosticCategory.Message,
      code: 0,
    };
  }

  private static getSourceFile(fileName: string | undefined | null): ts.SourceFile | undefined {
    if (!fileName) {
      return undefined;
    }

    return Context.program.getSourceFile(fileName);
  }

  private static getDiagnosticCode(message: AbstractCompilationMessage): any {
    if (Context.languageServiceMode) {
      return 0;
    } else {
      return `(clawject ${message.code})`;
    }
  }
}
