import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@repo/database';

import { EapInvite } from '../../domain/EapInvite.js';
import { EapInviteRepositoryPort } from '../application/ports/eapInvite-repository.port.js';

@Injectable()
export class PrismaEapInviteRepository extends EapInviteRepositoryPort {
  constructor(private readonly db: PrismaClient) {
    super();
  }

  async generate() {
    const entity = await this.db.earlyAccessProgramInvitation.create({
      data: {},
    });

    return EapInvite.fromPersistence(entity);
  }

  async findById(id: string) {
    const entity = await this.db.earlyAccessProgramInvitation.findUnique({
      where: {
        id,
      },
    });
    if (!entity) return null;

    return EapInvite.fromPersistence(entity);
  }

  async delete(invite: EapInvite) {
    const entity = await this.db.earlyAccessProgramInvitation.delete({
      where: {
        id: invite.id,
      },
    });

    return !!entity;
  }
}
