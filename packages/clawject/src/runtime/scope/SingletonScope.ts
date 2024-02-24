import { ConversationId, Scope } from '../api/Scope';
import { ObjectFactory, ObjectFactoryResult } from '../api/ObjectFactory';
import { Callback } from './Callback';

export class SingletonScope implements Scope {
  private scopedObjects = new Map<string, ObjectFactoryResult>();

  registerConversationBeginCallback(callback: (conversationId: ConversationId) => void | Promise<void>): void {}
  registerConversationEndedCallback(callback: (conversationId: ConversationId) => void | Promise<void>): void {}

  get(conversationId: ConversationId, name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    const instance = this.scopedObjects.get(name) ?? objectFactory.getObject();
    this.scopedObjects.set(name, instance);

    return instance;
  }

  registerDestructionCallback(name: string, callback: Callback): void {}

  remove(name: string): ObjectFactoryResult | null {
    const instance = this.scopedObjects.get(name) ?? null;

    this.scopedObjects.delete(name);

    return instance;
  }

  useProxy(): boolean {
    return false;
  }
}
