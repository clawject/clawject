import { NodeDetails } from '../../../core/ts/utils/getNodeDetails';

export interface ILinkStatistics {
    linkType: LinkType;
    fromPosition: ILinkPositionDescriptor;
    toPosition: ILinkPositionDescriptor;
    presentableName: string;
}

export interface ILinkPositionDescriptor {
    path: string;
    nodePosition: NodeDetails;
}

export enum LinkType {
    BEAN_USAGE_DECLARATION = 'BEAN_USAGE_DECLARATION',
    QUALIFIED_BEAN_DECLARATION = 'QUALIFIED_BEAN_DECLARATION',
    BEAN_DECLARATION = 'BEAN_DECLARATION',
    CONTEXT_IMPLEMENTATION = 'CONTEXT_IMPLEMENTATION',
}
