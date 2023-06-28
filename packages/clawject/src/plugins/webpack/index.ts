import { Compilation, Compiler, NormalModule } from 'webpack';
import { RebuildStatusRepository } from './RebuildStatusRepository';
import { getCompilationContext } from '../../transformer/getCompilationContext';
import { BuildErrorFormatter } from '../../compilation-context/BuildErrorFormatter';
import { ConfigurationRepository } from '../../core/configuration/ConfigurationRepository';
import { Configuration } from '../../core/configuration/Configuration';

const reportDIErrorsHook = (compilation: Compilation) => {
    const compilationContext = getCompilationContext();
    const message = BuildErrorFormatter.formatErrors(
        compilationContext.errors,
    );

    if (message === null) {
        return;
    }

    compilation.errors.push(buildWebpackError(message));
};

export default class ClawjectWebpackPlugin {
    private static isErrorsHandledByWebpack = false;

    constructor() {
        ClawjectWebpackPlugin.isErrorsHandledByWebpack = true;
    }

    apply(compiler: Compiler) {
        compiler.hooks.afterEmit.tap(ClawjectWebpackPlugin.name, reportDIErrorsHook);

        compiler.hooks.done.tap(ClawjectWebpackPlugin.name, (stats) => {
            RebuildStatusRepository.clear();
        });

        compiler.hooks.compilation.tap(ClawjectWebpackPlugin.name, (compilation) => {
            const webpack4ChangedFiles = Object.keys((compiler as any).watchFileSystem?.watcher?.mtimes ?? {});

            const changedFiles = webpack4ChangedFiles.length > 0
                ? webpack4ChangedFiles
                : Array.from(compiler.modifiedFiles ?? []);
            const changedFilesSet = new Set(changedFiles);

            const relatedPathToContexts = Array.from(ConfigurationRepository.configurationIdToConfiguration.values())
                .reduce((acc, context) => {
                    context.relatedPaths.forEach(path => {
                        const set = acc.get(path) ?? new Set<Configuration>();
                        set.add(context);
                        acc.set(path, set);
                    });

                    return acc;
                }, new Map<string, Set<Configuration>>());

            const contextsToRebuild = changedFiles.reduce((acc, changedFileName) => {
                relatedPathToContexts.get(changedFileName)?.forEach(context => {
                    if (!changedFilesSet.has(context.fileName)) {
                        acc.add(context.fileName);
                    }
                });
                return acc;
            }, new Set<string>());

            compilation.hooks.finishModules.tapAsync(
                ClawjectWebpackPlugin.name,
                (modules, callback) => {
                    if (contextsToRebuild.size === 0) {
                        callback();
                        return;
                    }

                    const contextModules = Array.from(modules)
                        .filter(it => contextsToRebuild.has((it as NormalModule).resource)) as NormalModule[];

                    if (contextsToRebuild.size !== contextModules.length) {
                        callback(buildWebpackError('Not all contexts found in webpack modules'));
                        return;
                    }

                    RebuildStatusRepository.setCallback(callback);
                    RebuildStatusRepository.registerStartRebuild(contextModules.map(it => (it as NormalModule).resource));
                    contextsToRebuild.clear();

                    contextModules.forEach(module => {
                        compilation.rebuildModule(module, err => {
                            if (err) {
                                compilation.errors.push(err);
                            } else {
                                RebuildStatusRepository.registerFileRebuildEnd((module as NormalModule).resource);
                            }
                        });
                    });
                }
            );
        });
    }
}

function buildWebpackError(message: string): any {
    return new Error(message) as any;
}
