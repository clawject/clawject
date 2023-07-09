import { InternalApplicationFactory } from './___INTERNAL___';

export type runClawjectApplication = () => void;
export const runClawjectApplication: runClawjectApplication = () => {
  InternalApplicationFactory.run();
};
