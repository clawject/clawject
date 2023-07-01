import { ProgramOptionsProvider } from '../program-options/ProgramOptionsProvider';
import { ClawjectService } from './ClawjectService';
import { FileSystemHandler } from './handlers/FileSystemHandler';
import { ProcessFilesHandler } from './handlers/ProcessFilesHandler';
import { StatisticsCollector } from './statistics/StatisticsCollector';

(async () => {
    const statisticsCollector = new StatisticsCollector();
    const fileSystemHandler = new FileSystemHandler();
    const processFilesHandler = new ProcessFilesHandler(statisticsCollector);
    const clawjectService = new ClawjectService(fileSystemHandler, processFilesHandler);

    ProgramOptionsProvider.init();

    await clawjectService.run();
})();
