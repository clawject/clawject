import { Application } from '../application/Application';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependency-graph/buildDependencyGraphAndFillQualifiedBeans';
import { verifyBeanNameUniqueness } from '../bean/verifyBeans';
import { reportAboutCircularDependencies } from '../report-circular-dependencies/reportAboutCircularDependencies';
import { fillExposedBeans } from './fillExposedBeans';
import { fillImports } from './fillImports';
import { reportApplicationInfoAndWarnings } from './reportApplicationInfoAndWarnings';
import { filterSet } from '../utils/filterSet';

export const processApplication = (application: Application): void => {
  verifyBeanNameUniqueness(
    filterSet(application.beans, it => !it.isLifecycle()),
    application,
  );
  fillImports(application);
  buildDependencyGraphAndFillQualifiedBeans(application, application.beans);
  reportAboutCircularDependencies(application);
  fillExposedBeans(application);
  reportApplicationInfoAndWarnings(application);
};

