import { AbstractStatistics, StatisticsType } from './AbstractStatistics';
import { getNodeDetails, NodeDetails } from '../../core/ts/utils/getNodeDetails';

export class ContextDetailsStatistics extends AbstractStatistics {
    public type = StatisticsType.CONTEXT_DETAILS;
    public path: string;
    public name: string | null;
    public namePosition: NodeDetails | null = null;
    public classPosition: NodeDetails;
    public beansCount: number;

    constructor(contextDescriptor: IContextDescriptor) {
        super();

        this.path = contextDescriptor.fileName;
        this.name = contextDescriptor.name;
        this.namePosition = contextDescriptor.node.name ? getNodeDetails(contextDescriptor.node.name) : null;
        this.classPosition = getNodeDetails(contextDescriptor.node);
        this.beansCount = (BeanRepository.contextDescriptorToBeanDescriptors.get(contextDescriptor) ?? []).length;
    }
}
