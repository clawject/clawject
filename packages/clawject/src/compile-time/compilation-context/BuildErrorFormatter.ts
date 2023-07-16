import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';
import { NodeDetails } from '../core/ts/utils/getNodeDetails';
import chalk from 'chalk';
import { BeanCandidateNotFoundError } from './messages/errors/BeanCandidateNotFoundError';
import upath from 'upath';

export class BuildErrorFormatter {
  static formatErrors(compilationErrors: AbstractCompilationMessage[]): string | null {
    const configurationPathToCompilationErrors = this.groupByConfiguration(compilationErrors);

    const formattedCompilationErrors = new Set<string>();

    configurationPathToCompilationErrors.forEach((errors, contextPath) => {
      const formattedErrors = errors.map(it => this.formatError(it)).join('\n');

      if (contextPath === null || errors.length === 0) {
        formattedCompilationErrors.add(formattedErrors);
        return;
      }

      const relatedConfigurationMetadata = errors[0].relatedConfigurationMetadata!;

      const configurationPrefix = `${chalk.red('\nErrors occurred in')}: ${relatedConfigurationMetadata.name}. ${this.getPathWithPosition(contextPath, relatedConfigurationMetadata.nameNodeDetails ?? relatedConfigurationMetadata.nodeDetails)}`;

      formattedCompilationErrors.add(configurationPrefix + '\n' + formattedErrors);
    });

    if (formattedCompilationErrors.size === 0) {
      return null;
    }

    return Array.from(formattedCompilationErrors.values()).join('\n') + '\n';
  }

  private static groupByConfiguration(errors: AbstractCompilationMessage[]): Map<string | null, AbstractCompilationMessage[]> {
    return errors.reduce((acc, curr) => {
      const list: AbstractCompilationMessage[] = acc.get(curr.relatedConfigurationMetadata?.fileName ?? null) ?? [];

      if (!acc.has(curr.relatedConfigurationMetadata?.fileName ?? null)) {
        acc.set(curr.relatedConfigurationMetadata?.fileName ?? null, list);
      }

      list.push(curr);

      return acc;
    }, new Map<string | null, AbstractCompilationMessage[]>());
  }

  static formatError(error: AbstractCompilationMessage): string {
    const filePathWithPosition = this.getPathWithPosition(error.place.filePath, error.place);

    const errorDetails = error.details === null
      ? ''
      : ` ${error.details}`;

    const baseMessage = `${chalk.red('Error')} ${chalk.gray(error.code + ':')} ${error.description}${errorDetails} ${filePathWithPosition}`;

    if (error instanceof BeanCandidateNotFoundError) {
      const candidatesByType = this.formatCandidates(error.candidatesByType);
      const candidatesByName = this.formatCandidates(error.candidatesByName);
      const messageCandidatesByType = candidatesByType ? `${chalk.red('  Possibly suitable candidates by type:')}\n${candidatesByType}` : '';
      const messageCandidatesByName = candidatesByName ? `${chalk.red('  Possibly suitable candidates by name:')}\n${candidatesByName}` : '';

      return [baseMessage, messageCandidatesByType, messageCandidatesByName].filter(it => it).join('\n');
    }

    return baseMessage;
  }

  private static getPathWithPosition(
    path: string,
    nodeDetails: NodeDetails,
  ): string {
    return `file://${upath.normalize(path)}:${nodeDetails.start.line}:${nodeDetails.start.col}`;
  }

  private static formatCandidates(candidates: NodeDetails[]): string {
    return candidates.map(it => {
      const declarationName = it.declarationName ? `${it.declarationName}: ` : '';

      return `    ${declarationName}${this.getPathWithPosition(it.filePath, it)}`;
    }).join('\n');
  }
}
