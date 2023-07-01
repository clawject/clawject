import { ICompilationMessage } from '../../../compilation-context/messages/ICompilationMessage';
import { StatisticsType } from '../../statistics/AbstractStatistics';

//TODO add more stats
export interface IProcessFilesResponse {
    compilationMessages: ICompilationMessage[];
    statistics: IProcessFilesStatistics[];
    projectModificationStamp: string;
    affectedFiles: string[]
}

export interface IProcessFilesStatistics {
    type: StatisticsType;
    payload: string;
}
