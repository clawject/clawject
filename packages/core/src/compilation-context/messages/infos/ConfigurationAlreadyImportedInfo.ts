import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import type ts from 'typescript';
import { Import } from '../../../core/import/Import';
import { Application } from '../../../core/application/Application';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { InfoCode } from '../InfoCode';
import { Configuration } from '../../../core/configuration/Configuration';

export class ConfigurationAlreadyImportedInfo extends AbstractCompilationMessage {
  public code = InfoCode.CI1;
  public description = 'This configuration is already imported.';

  relatedImportsDetails: NodeDetails[];

  constructor(
    place: ts.Node,
    otherImports: Import[],
    relatedConfiguration: Configuration | null,
    relatedApplication: Application | null,
  ) {
    super(null, place, relatedConfiguration, relatedApplication);

    this.relatedImportsDetails = otherImports.map(it => getNodeDetails(it.node));
  }
}
