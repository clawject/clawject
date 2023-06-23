import { AbstractStatistics, StatisticsType } from '../AbstractStatistics';
import { getNodeDetails } from '../../../core/ts/utils/getNodeDetails';
import upath from 'upath';
import { ILinkPositionDescriptor, ILinkStatistics, LinkType } from './ILinkStatistics';

export class QualifiedBeanDeclarationLinkStatistics extends AbstractStatistics implements ILinkStatistics {

    static build(dependencyDescriptor: IBeanDependencyDescriptor | ILifecycleDependencyDescriptor): QualifiedBeanDeclarationLinkStatistics[] {
        const result: QualifiedBeanDeclarationLinkStatistics[] = [];

        dependencyDescriptor.qualifiedBeans.forEach(beanDescriptor => {
            const linkPosition: ILinkPositionDescriptor = {
                path: upath.normalize(dependencyDescriptor.node.getSourceFile().fileName),
                nodePosition: getNodeDetails(dependencyDescriptor.node.name),
            };

            result.push(new QualifiedBeanDeclarationLinkStatistics(beanDescriptor, linkPosition));
        });

        return result;
    }

    public type = StatisticsType.LINK;
    public linkType = LinkType.QUALIFIED_BEAN_DECLARATION;
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
            nodePosition: getNodeDetails(descriptor.node)
        };

        this.presentableName = `${descriptor.contextDescriptor.name}::${descriptor.classMemberName}`;

        this.fromPosition = linkPosition;
    }
}
