import ts from 'typescript';
import upath from 'upath';
import { AbstractStatistics, StatisticsType } from '../AbstractStatistics';
import { getNodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { ILinkPositionDescriptor, ILinkStatistics, LinkType } from './ILinkStatistics';
import { isNamedClassDeclaration } from '../../../core/ts/predicates/isNamedClassDeclaration';

export class BeanUsageLinkStatistics extends AbstractStatistics implements ILinkStatistics {

    static build(beanDescriptor: IBeanDescriptor, dependencyDescriptors: (IBeanDependencyDescriptor | ILifecycleDependencyDescriptor)[]): BeanUsageLinkStatistics[] {
        const result: BeanUsageLinkStatistics[] = [];

        const fromPosition: ILinkPositionDescriptor = {
            path: beanDescriptor.contextDescriptor.fileName,
            nodePosition: getNodeDetails(beanDescriptor.node.name),
        };

        dependencyDescriptors.forEach(dependencyDescriptor => {
            const toPosition: ILinkPositionDescriptor = {
                path: upath.normalize(dependencyDescriptor.node.getSourceFile().fileName),
                nodePosition: getNodeDetails(dependencyDescriptor.node.name)
            };

            const presentableName = this.buildPresentableName(dependencyDescriptor);

            result.push(new BeanUsageLinkStatistics(toPosition, fromPosition, presentableName));
        });

        if (beanDescriptor.publicInfo !== null) {
            const toPosition: ILinkPositionDescriptor = {
                path: upath.normalize(beanDescriptor.publicInfo.publicNode.getSourceFile().fileName),
                nodePosition: getNodeDetails(beanDescriptor.publicInfo.publicNode.name),
            };

            let parentName: string | null = null;

            if (ts.isInterfaceDeclaration(beanDescriptor.publicInfo.publicNode.parent)) {
                parentName = beanDescriptor.publicInfo.publicNode.parent.name.getText();
            }

            const presentableName = parentName === null
                ? `::${beanDescriptor.classMemberName}`
                : `${parentName}::${beanDescriptor.classMemberName}`;

            result.push(new BeanUsageLinkStatistics(toPosition, fromPosition, presentableName));
        }

        return result;
    }

    private static buildPresentableName(dependencyDescriptor: IBeanDependencyDescriptor | ILifecycleDependencyDescriptor): string {
        const parameterParent: ts.SignatureDeclaration | null = dependencyDescriptor.node?.parent ?? null;
        const signatureParent: ts.Node | null = parameterParent?.parent ?? null;

        if (parameterParent === null || signatureParent === null) {
            return dependencyDescriptor.node.getText();
        }

        let methodName: string | null = null;

        if (!isNamedClassDeclaration(signatureParent)) {
            return dependencyDescriptor.node.getText();
        }

        if (ts.isConstructSignatureDeclaration(parameterParent) || ts.isConstructorDeclaration(parameterParent)) {
            methodName = 'constructor';
        } else {
            methodName = parameterParent.name?.getText() ?? null;
        }

        if (methodName === null) {
            return `${signatureParent.name.getText()}::${dependencyDescriptor.parameterName}`;
        }

        return `${signatureParent.name.getText()}::${methodName}::${dependencyDescriptor.parameterName}`;
    }

    public type = StatisticsType.LINK;
    public linkType = LinkType.BEAN_USAGE_DECLARATION;
    public fromPosition: ILinkPositionDescriptor;
    public toPosition: ILinkPositionDescriptor;
    public presentableName: string;

    private constructor(
        toPosition: ILinkPositionDescriptor,
        fromPosition: ILinkPositionDescriptor,
        presentableName: string
    ) {
        super();

        this.toPosition = toPosition;
        this.fromPosition = fromPosition;
        this.presentableName = presentableName;
    }
}
