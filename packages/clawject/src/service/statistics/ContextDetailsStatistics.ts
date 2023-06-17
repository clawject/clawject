import { AbstractStatistics, StatisticsType } from './AbstractStatistics';
import { getPositionOfNode, INodePosition } from '../../core/ts/utils/getPositionOfNode';

export class ContextDetailsStatistics extends AbstractStatistics {
    public type = StatisticsType.CONTEXT_DETAILS;
    public path: string;
    public name: string | null;
    public namePosition: INodePosition | null = null;
    public classPosition: INodePosition;
    public beansCount: number;

    constructor(contextDescriptor: IContextDescriptor) {
        super();

        this.path = contextDescriptor.fileName;
        this.name = contextDescriptor.name;
        this.namePosition = contextDescriptor.node.name ? getPositionOfNode(contextDescriptor.node.name) : null;
        this.classPosition = getPositionOfNode(contextDescriptor.node);
        this.beansCount = (BeanRepository.contextDescriptorToBeanDescriptors.get(contextDescriptor) ?? []).length;
    }
}
