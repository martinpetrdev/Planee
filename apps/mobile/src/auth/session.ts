import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

interface ISession {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: string;
}

export class SessionStore {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  async saveSession(session: ISession): Promise<void> {
    const stringified = JSON.stringify(session);

    await setItemAsync(this.key, stringified);
  }

  async getSession(): Promise<ISession | null> {
    const stringified = await getItemAsync(this.key);

    return JSON.parse(stringified ?? "null") as ISession | null;
  }

  async clearSession(): Promise<void> {
    await deleteItemAsync(this.key);
  }
}
