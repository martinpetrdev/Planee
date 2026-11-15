export abstract class PushTokenRepositoryPort {
  abstract register(userId: string, token: string): Promise<void>;
  abstract unregister(userId: string, token: string): Promise<void>;
  abstract findByUser(userId: string): Promise<string[]>;
  abstract unregisterByToken(token: string): Promise<void>;
}
