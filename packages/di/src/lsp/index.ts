import { ClawjectLanguageServicePlugin as CorePlugin } from '@clawject/core/lsp';
import tsServer from 'typescript/lib/tsserverlibrary';

/**
 * @public
 * */
export const ClawjectLanguageServicePlugin: (modules: {
  typescript: typeof tsServer
}) => { create(info: tsServer.server.PluginCreateInfo): tsServer.LanguageService } = CorePlugin;

