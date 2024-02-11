import ts from 'typescript';
import { Configuration } from '../../core/configuration/Configuration';
import { MessageCode } from './MessageCode';
import { MessageType } from './MessageType';
import { getNodeDetails, NodeDetails } from '../../core/ts/utils/getNodeDetails';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { Application } from '../../core/application/Application';

export interface IRelatedConfigurationOrApplicationMetadata {
  name: string;
  fileName: string;
  nodeDetails: NodeDetails;
  nameNodeDetails: NodeDetails | null;
}

export abstract class AbstractCompilationMessage {
  public abstract code: MessageCode;
  public abstract type: MessageType;
  public abstract description: string;

  public readonly place: NodeDetails;
  public readonly relatedConfigurationMetadata: IRelatedConfigurationOrApplicationMetadata | null;
  public readonly relatedApplicationMetadata: IRelatedConfigurationOrApplicationMetadata | null;

  contextualFileName: string;

  public constructor(
    public readonly details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    application: Application | null = null,
  ) {
    this.place = getNodeDetails(place);
    this.relatedConfigurationMetadata = this.getRelatedConfigurationMetadata(relatedConfiguration);
    this.relatedApplicationMetadata = application
      ? this.getRelatedConfigurationMetadata(application.rootConfiguration)
      : null;

    this.contextualFileName = getCompilationContext().contextualFileName;
  }

  private getRelatedConfigurationMetadata(relatedConfiguration: Configuration | null): IRelatedConfigurationOrApplicationMetadata | null {
    if (relatedConfiguration === null) {
      return null;
    }

    return {
      name: relatedConfiguration.className ?? '<anonymous>',
      fileName: relatedConfiguration.fileName,
      nodeDetails: getNodeDetails(relatedConfiguration.node),
      nameNodeDetails: relatedConfiguration.node.name ? getNodeDetails(relatedConfiguration.node.name) : null,
    };
  }
}
