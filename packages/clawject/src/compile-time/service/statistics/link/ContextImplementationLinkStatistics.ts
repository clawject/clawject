import { AbstractStatistics, StatisticsType } from '../AbstractStatistics';
import { ILinkPositionDescriptor, ILinkStatistics, LinkType } from './ILinkStatistics';
import { getNodeDetails } from '../../../core/ts/utils/getNodeDetails';
import upath from 'upath';

export class ContextImplementationLinkStatistics extends AbstractStatistics implements ILinkStatistics {

    static build(contextInterfaceDescriptor: IContextInterfaceDescriptor): ContextImplementationLinkStatistics[] {
        const result: ContextImplementationLinkStatistics[] = [];

        result.push(new ContextImplementationLinkStatistics(contextInterfaceDescriptor));

        return result;
    }

    public type = StatisticsType.LINK;
    public linkType = LinkType.CONTEXT_IMPLEMENTATION;
    public fromPosition: ILinkPositionDescriptor;
    public toPosition: ILinkPositionDescriptor;
    public presentableName: string;

    private constructor(
        contextInterfaceDescriptor: IContextInterfaceDescriptor
    ) {
        super();

        this.toPosition = {
            path: contextInterfaceDescriptor.contextDescriptor.fileName,
            nodePosition: getNodeDetails(contextInterfaceDescriptor.contextDescriptor.node.name)
        };

        this.fromPosition = {
            path: upath.normalize(contextInterfaceDescriptor.node.getSourceFile().fileName),
            nodePosition: getNodeDetails(contextInterfaceDescriptor.node.name)
        };

        this.presentableName = contextInterfaceDescriptor.contextDescriptor.name;
    }
}
