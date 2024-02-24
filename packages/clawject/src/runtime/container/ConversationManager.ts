import { Scope } from '../api/Scope';

export class ConversationManager {
  private static scopeNameToScope = new Map<string | number, Scope>();

  static onScopeRegistered(scopeName: string | number, scope: Scope): void {

  }
}
