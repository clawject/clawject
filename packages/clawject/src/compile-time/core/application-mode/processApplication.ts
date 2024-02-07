import { Application } from '../application/Application';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependency-graph/buildDependencyGraphAndFillQualifiedBeans';
import { verifyBeanNameUniqueness } from '../bean/verifyBeans';
import { reportAboutCircularDependencies } from '../report-cyclic-dependencies/reportAboutCircularDependencies';

export const processApplication = (application: Application): void => {
  verifyBeanNameUniqueness(application.beans);
  buildDependencyGraphAndFillQualifiedBeans(application, Array.from(application.beans), application.dependencyGraph);
  reportAboutCircularDependencies(application.dependencyGraph);
};
