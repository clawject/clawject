import { Application } from '../../application/Application';
import { buildDependencyGraphAndFillQualifiedBeans } from '../../dependency-graph/buildDependencyGraphAndFillQualifiedBeans';
import { verifyBeanNameUniqueness } from '../../bean/verifyBeans';
import { reportAboutCircularDependencies } from '../../report-circular-dependencies/reportAboutCircularDependencies';
import { fillExposedBeans } from '../fillExposedBeans';
import { reportApplicationInfoAndWarnings } from '../reportApplicationInfoAndWarnings';
import { filterSet } from '../../utils/filterSet';
import { Logger } from '../../../logger/Logger';
import { processApplicationImports } from './processApplicationImports';
import { ConfigurationRepository } from '../../configuration/ConfigurationRepository';

export const processApplication = (application: Application): void => {
  processApplicationImports(application);
  buildDependencyGraphAndFillQualifiedBeans(application, application.beansArray);

  // const verifyBeanNameUniquenessLabel = `Verifying bean name uniqueness, file: ${application.node.getSourceFile().fileName}, class: ${application.node.name?.text}`;
  // Logger.verboseDuration(verifyBeanNameUniquenessLabel);
  // verifyBeanNameUniqueness(
  //   filterSet(application.beans, it => !it.isLifecycle()),
  //   application,
  // );
  // Logger.verboseDuration(verifyBeanNameUniquenessLabel);
  //
  // const fillImportsLabel = `Filling imports, file: ${application.node.getSourceFile().fileName}, class: ${application.node.name?.text}`;
  // Logger.verboseDuration(fillImportsLabel);
  // fillImports(application);
  // Logger.verboseDuration(fillImportsLabel);
  //
  // const buildDependencyGraphAndFillQualifiedBeansLabel = `Building dependency graph and filling qualified beans, file: ${application.node.getSourceFile().fileName}, class: ${application.node.name?.text}`;
  // Logger.verboseDuration(buildDependencyGraphAndFillQualifiedBeansLabel);
  // buildDependencyGraphAndFillQualifiedBeans(application, application.beansArray);
  // Logger.verboseDuration(buildDependencyGraphAndFillQualifiedBeansLabel);
  //
  // const reportAboutCircularDependenciesLabel = `Reporting about circular dependencies, file: ${application.node.getSourceFile().fileName}, class: ${application.node.name?.text}`;
  // Logger.verboseDuration(reportAboutCircularDependenciesLabel);
  // reportAboutCircularDependencies(application);
  // Logger.verboseDuration(reportAboutCircularDependenciesLabel);
  //
  // const fillExposedBeansLabel = `Filling exposed beans, file: ${application.node.getSourceFile().fileName}, class: ${application.node.name?.text}`;
  // Logger.verboseDuration(fillExposedBeansLabel);
  // fillExposedBeans(application);
  // Logger.verboseDuration(fillExposedBeansLabel);
  //
  // const reportApplicationInfoAndWarningsLabel = `Reporting application info and warnings, file: ${application.node.getSourceFile().fileName}, class: ${application.node.name?.text}`;
  // Logger.verboseDuration(reportApplicationInfoAndWarningsLabel);
  // reportApplicationInfoAndWarnings(application);
  // Logger.verboseDuration(reportApplicationInfoAndWarningsLabel);
};

