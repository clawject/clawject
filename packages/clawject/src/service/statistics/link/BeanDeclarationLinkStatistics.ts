import { AbstractStatistics, StatisticsType } from '../AbstractStatistics';
import { getPositionOfNode } from '../../../core/ts/utils/getPositionOfNode';
import upath from 'upath';
import { isNamedClassDeclaration } from '../../../core/ts/predicates/isNamedClassDeclaration';
import { ILinkPositionDescriptor, ILinkStatistics, LinkType } from './ILinkStatistics';

export class BeanDeclarationLinkStatistics extends AbstractStatistics implements ILinkStatistics {

    static build(descriptor: IBeanDescriptor): BeanDeclarationLinkStatistics[] {
        const result: BeanDeclarationLinkStatistics[] = [];

        if (descriptor.publicInfo !== null) {
            const linkPosition: ILinkPositionDescriptor = {
                path: upath.normalize(descriptor.publicInfo.publicNode.getSourceFile().fileName),
                nodePosition: getPositionOfNode(descriptor.publicInfo.publicNode.name),
            };

            result.push(new BeanDeclarationLinkStatistics(descriptor, linkPosition));
        }

        if (
            descriptor.beanKind === 'property'
            && descriptor.beanImplementationSource?.node
            && isNamedClassDeclaration(descriptor.beanImplementationSource.node)
        ) {
            const linkPosition: ILinkPositionDescriptor = {
                path: descriptor.beanImplementationSource.path,
                nodePosition: getPositionOfNode(descriptor.beanImplementationSource.node.name),
            };

            result.push(new BeanDeclarationLinkStatistics(descriptor, linkPosition));
        }

        return result;
    }

    public type = StatisticsType.LINK;
    public linkType = LinkType.BEAN_DECLARATION;
    public fromPosition: ILinkPositionDescriptor;
    public toPosition: ILinkPositionDescriptor;
    public presentableName: string;

    private constructor(
        descriptor: IBeanDescriptor,
        linkPosition: ILinkPositionDescriptor,
    ) {
        super();

        this.toPosition = {
            path: descriptor.contextDescriptor.fileName,
            nodePosition: getPositionOfNode(descriptor.node)
        };

        this.presentableName = `${descriptor.contextDescriptor.name}::${descriptor.classMemberName}`;

        this.fromPosition = linkPosition;
    }
}
