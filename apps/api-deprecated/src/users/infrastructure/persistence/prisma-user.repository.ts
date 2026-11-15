import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@repo/database';

import { UserProvisioningPort } from '../../domain/ports/user-provisioning.port.js';

@Injectable()
export class PrismaUserRepository extends UserProvisioningPort {
  constructor(private readonly db: PrismaClient) {
    super();
  }

  async ensureProvisioned(id: string): Promise<void> {
    // TODO: Add PK caching, if this is too costly
    await this.db.user.upsert({
      where: { id },
      create: { id },
      update: {},
    });
  }
}
