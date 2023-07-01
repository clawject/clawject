export abstract class AbstractStatistics {

    abstract type: StatisticsType;
}

export enum StatisticsType {
    CONTEXT_DETAILS = 'CONTEXT_DETAILS',
    LINK = 'LINK',
}
