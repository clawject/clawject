import { AbstractCompilationMessage } from './messages/AbstractCompilationMessage';
import { INodePosition } from '../core/ts/utils/getPositionOfNode';
import chalk from 'chalk';

export class BuildErrorFormatter {
    static formatErrors(compilationErrors: AbstractCompilationMessage[]): string | null {
        const contextPathToCompilationErrors = this.groupByContexts(compilationErrors);

        const formattedCompilationErrors = new Set<string>();

        contextPathToCompilationErrors.forEach((errors, contextPath) => {
            const formattedErrors = errors.map(it => this.formatError(it)).join('\n');

            if (contextPath === null || errors.length === 0) {
                formattedCompilationErrors.add(formattedErrors);
                return;
            }

            const contextDetails = errors[0].contextDetails!;

            const contextPrefix = `${chalk.red('\nErrors occurred in')}: ${contextDetails.name} ${this.getPathWithPosition(contextPath, contextDetails.namePosition)}`;

            formattedCompilationErrors.add(contextPrefix + '\n' + formattedErrors);
        });

        if (formattedCompilationErrors.size === 0) {
            return null;
        }

        return Array.from(formattedCompilationErrors.values()).join('\n') + '\n';
    }

    private static groupByContexts(errors: AbstractCompilationMessage[]): Map<string | null, AbstractCompilationMessage[]> {
        return errors.reduce((acc, curr) => {
            const list: AbstractCompilationMessage[] = acc.get(curr.contextDetails?.path ?? null) ?? [];

            if (!acc.has(curr.contextDetails?.path ?? null)) {
                acc.set(curr.contextDetails?.path ?? null, list);
            }

            list.push(curr);

            return acc;
        }, new Map<string | null, AbstractCompilationMessage[]>());
    }

    private static formatError(error: AbstractCompilationMessage): string {
        const filePathWithPosition = this.getPathWithPosition(error.filePath, error.position);

        const errorDetails = error.details === null
            ? ''
            : ` ${error.details}`;

        return `${chalk.red('Error')} ${chalk.gray(error.code + ':')} ${error.description}${errorDetails} ${filePathWithPosition}`;
    }

    private static getPathWithPosition(
        path: string,
        position: INodePosition,
    ): string {
        return `file://${path}:${position.line}:${position.startColumn}`;
    }
}
