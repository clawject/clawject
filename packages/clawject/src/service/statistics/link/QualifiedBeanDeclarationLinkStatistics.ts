import { AbstractStatistics, StatisticsType } from '../AbstractStatistics';
import { getPositionOfNode } from '../../../core/ts/utils/getPositionOfNode';
import upath from 'upath';
import { ILinkPositionDescriptor, ILinkStatistics, LinkType } from './ILinkStatistics';

export class QualifiedBeanDeclarationLinkStatistics extends AbstractStatistics implements ILinkStatistics {

    static build(dependencyDescriptor: IBeanDependencyDescriptor | ILifecycleDependencyDescriptor): QualifiedBeanDeclarationLinkStatistics[] {
        const result: QualifiedBeanDeclarationLinkStatistics[] = [];

        dependencyDescriptor.qualifiedBeans.forEach(beanDescriptor => {
            const linkPosition: ILinkPositionDescriptor = {
                path: upath.normalize(dependencyDescriptor.node.getSourceFile().fileName),
                nodePosition: getPositionOfNode(dependencyDescriptor.node.name),
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
            nodePosition: getPositionOfNode(descriptor.node)
        };

        this.presentableName = `${descriptor.contextDescriptor.name}::${descriptor.classMemberName}`;

        this.fromPosition = linkPosition;
    }
}
