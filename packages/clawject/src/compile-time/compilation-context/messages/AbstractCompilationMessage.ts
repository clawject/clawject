import ts from 'typescript';
import { Configuration } from '../../core/configuration/Configuration';
import { ErrorCode } from './ErrorCode';
import { MessageType } from './MessageType';
import { getNodeDetails, NodeDetails } from '../../core/ts/utils/getNodeDetails';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { Application } from '../../core/application/Application';
import { WarningCode } from './WarningCode';
import { InfoCode } from './InfoCode';

export interface IRelatedConfigurationOrApplicationMetadata {
  name: string;
  fileName: string;
  nodeDetails: NodeDetails;
  nameNodeDetails: NodeDetails | null;
}

const errorCodes = new Set<string>(Object.values(ErrorCode));
const warningCodes = new Set<string>(Object.values(WarningCode));

export abstract class AbstractCompilationMessage {
  public abstract code: ErrorCode | WarningCode | InfoCode;
  get type(): MessageType {
    if (errorCodes.has(this.code)) {
      return MessageType.ERROR;
    }

    if (warningCodes.has(this.code)) {
      return MessageType.WARNING;
    }

    return MessageType.INFO;
  }
  public abstract description: string;

  public readonly place: NodeDetails;
  public readonly relatedConfigurationMetadata: IRelatedConfigurationOrApplicationMetadata | null;
  public readonly relatedApplicationMetadata: IRelatedConfigurationOrApplicationMetadata | null;

  contextualFileName: string;

  public constructor(
    public readonly details: string | null,
    place: ts.Node,
    relatedConfiguration: Configuration | null,
    relatedApplication: Application | null,
  ) {
    this.place = getNodeDetails(place);

    const rootConfiguration = relatedApplication?.rootConfiguration ?? null;

    if (relatedConfiguration === rootConfiguration) {
      this.relatedConfigurationMetadata = null;
    } else {
      this.relatedConfigurationMetadata = this.getRelatedConfigurationMetadata(relatedConfiguration);
    }

    this.relatedApplicationMetadata = relatedApplication
      ? this.getRelatedConfigurationMetadata(relatedApplication.rootConfiguration)
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
