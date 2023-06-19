import { ICommandHandler } from './ICommandHandler';
import { IProcessFilesResponse } from '../types/process-files/IProcessFilesResponse';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { DependencyGraph } from '../../core/dependencies/DependencyGraph';
import { IDisposable } from '../types/IDisposable';
import { IProcessFilesCommand } from '../types/process-files/IProcessFilesCommand';
import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { StatisticsCollector } from '../statistics/StatisticsCollector';
import { getTransformerFactory } from '../../core/build-context/getTransformerFactory';
import ts from 'typescript';
import { ConfigurationRepository } from '../../core/configuration/ConfigurationRepository';

export class ProcessFilesHandler implements ICommandHandler<IProcessFilesCommand, Promise<IProcessFilesResponse>>, IDisposable {
    constructor(
        private statisticsCollector: StatisticsCollector
    ) {
    }

    async invoke(command: IProcessFilesCommand): Promise<IProcessFilesResponse> {
        try {
            const compilationContext = new CompilationContext();
            const transformerFactory = getTransformerFactory(compilationContext);
            PathResolver.init();

            const sourceFiles = command.filesToProcess
                .map(it => SourceFilesCache.getSourceFileByPath(it));

            ts.transform(
                sourceFiles,
                [transformerFactory],
            );

            const affectedFiles = new Set<string>();

            return {
                compilationMessages: this.collectCompilationMessages(compilationContext, affectedFiles),
                statistics: this.statisticsCollector.invoke(affectedFiles),
                projectModificationStamp: command.projectModificationStamp,
                affectedFiles: Array.from(affectedFiles)
            };
        } finally {
            this.dispose();
        }
    }

    dispose(): void {
        DependencyGraph.clear();
        ConfigurationRepository.clear();
    }

    private collectCompilationMessages(
        compilationContext: CompilationContext,
        affectedFiles: Set<string>
    ): AbstractCompilationMessage[] {
        const result: AbstractCompilationMessage[] = [];

        compilationContext.messages.forEach(message => {
            result.push(message);

            affectedFiles.add(message.filePath);

            if (message.contextDetails !== null) {
                affectedFiles.add(message.contextDetails.path);
            }
        });

        return result;
    }
}
