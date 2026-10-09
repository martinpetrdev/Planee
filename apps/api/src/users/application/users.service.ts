import { Injectable } from '@nestjs/common';

import { EapProgramService } from '../../admin/programs/application/eap-program.service.js';
import { UserManagerPort } from '../domain/ports/user-manager.port.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly userManager: UserManagerPort,
    private readonly eapService: EapProgramService,
  ) {}

  async joinEap(props: { inviteId: string; email: string }) {
    await this.eapService.useInvite(props.inviteId); // Throws if invalid

    await this.userManager.inviteIntoTenant({
      tenantName: 'planee-eap',
      email: props.email,
    });
  }
}
