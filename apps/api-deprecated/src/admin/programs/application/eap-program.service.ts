import { Injectable } from '@nestjs/common';

import { ProgramEapInviteInvalidError } from '../domain/program.errors.js';
import { EapInviteRepositoryPort } from './ports/eapInvite-repository.port.js';

@Injectable()
export class EapProgramService {
  constructor(private readonly eapInviteRepository: EapInviteRepositoryPort) {}

  async invite() {
    return await this.eapInviteRepository.generate();
  }

  async useInvite(inviteId: string) {
    const invite = await this.eapInviteRepository.findById(inviteId);
    if (!invite) throw new ProgramEapInviteInvalidError();

    await this.eapInviteRepository.delete(invite);
  }
}
