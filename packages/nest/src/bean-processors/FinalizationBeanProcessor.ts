import { BeanProcessor, RuntimeErrors } from '@clawject/di';
import IllegalStateError = RuntimeErrors.IllegalStateError;

export class FinalizationBeanProcessor implements BeanProcessor {
  private callback: (() => void) | null = null;

  setCallback(callback: () => void): void {
    this.callback = callback;
  }

  onBeansInitialized() {
    if (!this.callback) {
      throw new IllegalStateError('Callback not set');
    }

    this.callback();
  }
}
