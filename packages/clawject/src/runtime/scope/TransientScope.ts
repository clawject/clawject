import { ConversationId, Scope } from '../api/Scope';
import { ObjectFactory, ObjectFactoryResult } from '../api/ObjectFactory';
import { Callback } from './Callback';

export class TransientScope implements Scope {
  registerConversationBeginCallback(callback: (conversationId: ConversationId) => void | Promise<void>): void {}
  registerConversationEndedCallback(callback: (conversationId: ConversationId) => void | Promise<void>): void {}

  get(conversationId: ConversationId, name: string, objectFactory: ObjectFactory): ObjectFactoryResult {
    return objectFactory.getObject();
  }

  registerDestructionCallback(name: string, callback: Callback): void {}

  remove(name: string): ObjectFactoryResult | null {
    return null;
  }

  useProxy(): boolean {
    return false;
  }
}
