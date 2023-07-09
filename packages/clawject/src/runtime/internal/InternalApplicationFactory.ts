import { ClassConstructor } from '../ClassConstructor';

export enum FactoryElementType {
  BEAN,
  CONFIGURATION,
  COMPONENT,
  AUTOWIRED,
}

export interface FactoryElement {
  type: FactoryElementType;
  id: string;
  parentId: string | null;
  classConstructor: ClassConstructor<any> | null;
}

export class InternalApplicationFactory {
  static idToBean: Map<string, FactoryElement> = new Map();
  static idToConfiguration: Map<string, FactoryElement> = new Map();
  static idToComponent: Map<string, FactoryElement> = new Map();
  static idToAutowired: Map<string, FactoryElement> = new Map();
  static idToType: Map<string, FactoryElementType> = new Map();

  static registerFactoryElements(...factoryElements: FactoryElement[]): void {
    factoryElements.forEach(factoryElement => {
      this.idToType.set(factoryElement.id, factoryElement.type);

      switch (factoryElement.type) {
      case FactoryElementType.BEAN:
        this.idToBean.set(factoryElement.id, factoryElement);
        break;
      case FactoryElementType.CONFIGURATION:
        this.idToConfiguration.set(factoryElement.id, factoryElement);
        break;
      case FactoryElementType.COMPONENT:
        this.idToComponent.set(factoryElement.id, factoryElement);
        break;
      case FactoryElementType.AUTOWIRED:
        this.idToAutowired.set(factoryElement.id, factoryElement);
        break;
      }
    });
  }

  static getInstanceFor(id: string): any {
    throw 'TODO';
  }

  static run() {
    console.log('Application run');
  }
}
