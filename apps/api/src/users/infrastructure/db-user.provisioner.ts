import { Injectable } from '@nestjs/common';
import { Database } from '@repo-shared/database';
import {
  AuthenticatedUser,
  UserProvisionerPort,
} from '@repo-shared/server-auth';

@Injectable()
export class DbUserProvisioner extends UserProvisionerPort {
  constructor(private readonly database: Database) {
    super();
  }

  async provision(authenticatedUser: AuthenticatedUser): Promise<void> {
    await this.database.user
      .create({
        data: {
          id: authenticatedUser.id,
        },
      })
      .catch(() => {
        // Ignore existing
      });
  }
}
