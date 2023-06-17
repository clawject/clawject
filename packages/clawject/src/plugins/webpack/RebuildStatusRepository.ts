export class RebuildStatusRepository {
    private static repo = new Set<string>();
    private static callback: (() => void) | null = null;

    static registerStartRebuild(files: string[]): void {
        this.repo = new Set(files);
    }

    static registerFileRebuildEnd(fileName: string): void {
        this.repo.delete(fileName);

        if (this.repo.size === 0 && this.callback) {
            this.callback();
        }
    }

    static clear(): void {
        this.repo.clear();
        this.callback = null;
    }

    static setCallback(callback: () => void): void {
        this.callback = callback;
    }
}
