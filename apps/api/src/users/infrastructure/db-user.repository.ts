import { Injectable } from '@nestjs/common';
import { Database, User as DbUser } from '@repo-shared/database';

import { User } from '../domain/User.ts';
import { UserRepositoryPort } from '../ports/user-repository.port.ts';

@Injectable()
export class DbUserRepository extends UserRepositoryPort {
  constructor(private readonly db: Database) {
    super();
  }

  async findById(id: string): Promise<User> {
    const entity = await this.db.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!entity) throw new Error(''); // TODO: Custom error

    return this.entityToDomain(entity);
  }

  private entityToDomain(entity: DbUser): User {
    return User.fromPersistence(entity);
  }
}
