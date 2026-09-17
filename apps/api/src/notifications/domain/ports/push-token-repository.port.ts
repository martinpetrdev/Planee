export abstract class PushTokenRepositoryPort {
  abstract register(userId: string, token: string): Promise<void>;
  abstract unregister(userId: string, token: string): Promise<void>;
}
