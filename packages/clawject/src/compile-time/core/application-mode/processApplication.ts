import { Application } from '../application/Application';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependency-graph/buildDependencyGraphAndFillQualifiedBeans';
import { verifyBeanNameUniqueness } from '../bean/verifyBeans';
import { reportAboutCircularDependencies } from '../report-cyclic-dependencies/reportAboutCircularDependencies';
import { fillExportedBeans } from './fillExportedBeans';
import { Import } from '../import/Import';
import { Configuration } from '../configuration/Configuration';
import { ResolvedConfigurationImport } from '../application/ResolvedConfigurationImport';

export const processApplication = (application: Application): void => {
  const arrayApplicationBeans = Array.from(application.beans);

  verifyBeanNameUniqueness(
    arrayApplicationBeans.filter(it => !it.isLifecycle())
  );
  fillImports(application);
  buildDependencyGraphAndFillQualifiedBeans(application, arrayApplicationBeans, application.dependencyGraph);
  reportAboutCircularDependencies(application.dependencyGraph);
  fillExportedBeans(application);
};

function fillImports(application: Application): void {
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
