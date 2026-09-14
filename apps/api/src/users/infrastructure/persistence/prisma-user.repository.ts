import { Injectable } from '@nestjs/common';
import { UserProvisioningPort } from '../../domain/ports/user-provisioning.port.js';
import { PrismaClient } from '@repo/database';

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
