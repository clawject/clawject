import tsServer from 'typescript/lib/tsserverlibrary';

export class LanguageServiceLogger {
  private static pluginInfo: tsServer.server.PluginCreateInfo | null = null;

  static assignPluginInfo(pluginInfo: tsServer.server.PluginCreateInfo): void {
    this.pluginInfo = pluginInfo;
  }

  private static prefix = '[Clawject] ';

  static log(msg: string, ...details: any[]): void {
    const logger = this.pluginInfo?.project.projectService.logger;

    if (!logger) {
      return;
    }

    let stringifiedDetails = '';

    if (details.length > 0) {
      try {
        stringifiedDetails = JSON.stringify(details);
      } catch (e) {
        logger.info(`${this.prefix}Failed to stringify other arguments`);
      }
    }

    logger.info(`${this.prefix}${msg}. details: ${stringifiedDetails}`);
  }
}
