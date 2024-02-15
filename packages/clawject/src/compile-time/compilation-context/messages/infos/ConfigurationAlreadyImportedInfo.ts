import { AbstractCompilationMessage } from '../AbstractCompilationMessage';
import ts from 'typescript';
import { Import } from '../../../core/import/Import';
import { Application } from '../../../core/application/Application';
import { getNodeDetails, NodeDetails } from '../../../core/ts/utils/getNodeDetails';
import { InfoCode } from '../InfoCode';

export class ConfigurationAlreadyImportedInfo extends AbstractCompilationMessage {
  public code = InfoCode.CI0;
  public description = 'This configuration is already imported.';

  relatedImportsDetails: NodeDetails[];

  constructor(
    place: ts.Node,
    otherImports: Import[],
    relatedApplication: Application
  ) {
    super(null, place, null, relatedApplication);

    this.relatedImportsDetails = otherImports.map(it => getNodeDetails(it.node));
  }
}
