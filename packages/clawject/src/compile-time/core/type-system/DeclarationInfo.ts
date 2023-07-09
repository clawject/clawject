import { escape } from 'lodash';

export class DeclarationInfo {
  declare isExported: boolean;
  declare isDefaultExported: boolean;
  declare isFromDefaultLib: boolean;
  declare fileName: string;
  moduleName: string | null = null;
  name: string | null = null;

  equals(other: DeclarationInfo): boolean {
    return this.isExported === other.isExported
      && this.isDefaultExported === other.isDefaultExported
      && this.isFromDefaultLib === other.isFromDefaultLib
      && this.fileName === other.fileName
      && this.moduleName === other.moduleName
      && this.name === other.name;
  }

  compareTo(other: DeclarationInfo): number {
    if (this.isExported !== other.isExported) {
      return this.isExported ? 1 : -1;
    }

    if (this.isDefaultExported !== other.isDefaultExported) {
      return this.isDefaultExported ? 1 : -1;
    }

    if (this.isFromDefaultLib !== other.isFromDefaultLib) {
      return this.isFromDefaultLib ? 1 : -1;
    }

    if (this.fileName !== other.fileName) {
      return this.fileName > other.fileName ? 1 : -1;
    }

    if (this.moduleName !== other.moduleName) {
      if (this.moduleName === null || other.moduleName === null) {
        return this.moduleName === null ? 1 : -1;
      }

      return this.moduleName > other.moduleName ? 1 : -1;
    }

    if (this.name !== other.name) {
      if (this.name === null || other.name === null) {
        return this.name === null ? 1 : -1;
      }

      return this.name > other.name ? 1 : -1;
    }

    return 0;
  }

  toString(): string {
    /**
     * e - isExported
     * d - isDefaultExported
     * dl - isFromDefaultLib
     * f - fileName
     * n - name
     * mn - moduleName
     * */
    const {
      isExported,
      isDefaultExported,
      isFromDefaultLib,
      fileName,
      name,
      moduleName,
    } = this;

    return `<e>${escape(isExported.toString())}</e>` +
      `<d>${escape(isDefaultExported.toString())}</d>` +
      `<dl>${escape(isFromDefaultLib.toString())}</dl>` +
      `<f>${escape(fileName.toString())}</f>` +
      `<n>${escape(name?.toString() ?? '')}</n>` +
      `<mn>${escape(moduleName?.toString() ?? '')}</mn>`;
  }
}
