import { Injectable } from '@nestjs/common';

import { EapInviteRepositoryPort } from './ports/eapInvite-repository.port.js';

@Injectable()
export class EapProgramService {
  constructor(private readonly eapInviteRepository: EapInviteRepositoryPort) {}

  async invite() {
    const invite = await this.eapInviteRepository.generate();

    return invite;
  }
}
