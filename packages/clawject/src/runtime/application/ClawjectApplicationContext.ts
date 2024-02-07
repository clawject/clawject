import { ClawjectContainer } from './ClawjectContainer';

export class ClawjectApplicationContext {
  constructor(
    private readonly container: ClawjectContainer,
  ) {}

  destroy(): Promise<void> {
    return this.container.destroy();
  }
}
