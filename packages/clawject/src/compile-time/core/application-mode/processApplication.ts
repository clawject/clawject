import { Application } from '../application/Application';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependency-graph/buildDependencyGraphAndFillQualifiedBeans';
import { verifyBeanNameUniqueness } from '../bean/verifyBeans';
import { reportAboutCircularDependencies } from '../report-cyclic-dependencies/reportAboutCircularDependencies';
import { fillExposedBeans } from './fillExposedBeans';
import { fillImports } from './fillImports';
import { reportApplicationInfoAndWarnings } from './reportApplicationInfoAndWarnings';

export const processApplication = (application: Application): void => {
  const arrayApplicationBeans = Array.from(application.beans);

  verifyBeanNameUniqueness(
    arrayApplicationBeans.filter(it => !it.isLifecycle()),
    application,
  );
  fillImports(application);
  buildDependencyGraphAndFillQualifiedBeans(application, arrayApplicationBeans);
  reportAboutCircularDependencies(application);
  fillExposedBeans(application);
  reportApplicationInfoAndWarnings(application);
};

