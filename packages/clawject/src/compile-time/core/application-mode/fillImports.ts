import { Application } from '../application/Application';
import { Configuration } from '../configuration/Configuration';
import { Import } from '../import/Import';
import { ResolvedConfigurationImport } from '../application/ResolvedConfigurationImport';

export function fillImports(application: Application): void {
  const configurationToImports = new Map<Configuration, Import[]>();

  application.forEachConfiguration((configuration) => {
    for (const importElement of configuration.importRegister.elements) {
      const resolvedConfiguration = importElement.resolvedConfiguration;

      if (resolvedConfiguration === null) {
        continue;
      }

      const imports = configurationToImports.get(resolvedConfiguration);
      if (!imports) {
        configurationToImports.set(resolvedConfiguration, [importElement]);
      } else {
        imports.push(importElement);
      }
    }
  });

  for (const [configuration, imports] of configurationToImports) {
    application.resolvedImports.set(configuration, new ResolvedConfigurationImport(imports, configuration));
  }
}
