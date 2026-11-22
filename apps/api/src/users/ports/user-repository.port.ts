import { User } from '../domain/User.ts';

export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<User>;
}
