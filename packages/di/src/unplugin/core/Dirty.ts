export class Dirty<C extends () => unknown> {
  constructor(
    private delay: number = 5,
    private onClean?: C
  ) {}

  private dirty = true;

  markDirty(): void {
    this.dirty = true;
  }

  waitClean(): Promise<Awaited<ReturnType<C>>> {
    return new Promise((resolve) => {
      const checkDirty = () => {
        if (this.dirty) {
          this.dirty = false;
          setTimeout(checkDirty, this.delay);
        } else {
          if (!this.onClean) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            resolve();
          }

          const result = this.onClean?.();

          if (result instanceof Promise) {
            result.then(resolve);
          } else {
            resolve(result as any);
          }
        }
      };

      checkDirty();
    });
  }
}
