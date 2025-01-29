import { Application } from '../application/Application';
import { ConfigurationAlreadyImportedInfo } from '../../compilation-context/messages/infos/ConfigurationAlreadyImportedInfo';
import { Context } from '../../compilation-context/Context';

export function reportApplicationInfoAndWarnings(application: Application): void {
  if (!Context.languageServiceMode) {
    return;
  }

  reportAboutImports(application);
}

function reportAboutImports(application: Application): void {
  // application.resolvedImports.forEach((resolvedImport) => {
  //   if (!resolvedImport.getExternalValue()) {
  //     return;
  //   }
  //
  //   const externalImports = resolvedImport.imports;/*.filter((it) => !it.definitionMetadata.internal);*/
  //
  //   if (externalImports.length < 2) {
  //     return;
  //   }
  //
  //   externalImports.forEach((importElement) => {
  //     const allWithoutCurrent = externalImports.filter((it) => it !== importElement);
  //
  //     Context.report(new ConfigurationAlreadyImportedInfo(
  //       importElement.node,
  //       allWithoutCurrent,
  //       null,
  //       application,
  //     ));
  //   });
  // });
}
