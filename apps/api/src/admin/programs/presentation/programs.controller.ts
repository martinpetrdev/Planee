import { Controller, Post } from '@nestjs/common';

import { ApiVersion } from '@repo/shared';

import { UserRole } from '../../../shared/auth/domain/user-role.js';
import { Roles } from '../../../shared/auth/presentation/decorators/roles.decorator.js';
import { EapProgramService } from '../application/eap-program.service.js';
import { EapInviteResponseDto } from './dto/eapInvite-response.dto.js';

@Controller({
  path: '/admin/programs',
  version: ApiVersion.v1,
})
@Roles(UserRole.Admin)
export class ProgramsController {
  constructor(private readonly eapProgram: EapProgramService) {}

  // TODO: Temporary, remove after removing EAP
  @Post('/eap/invite')
  async inviteEap() {
    const invite = await this.eapProgram.invite();

    return EapInviteResponseDto.fromDomain(invite);
  }
}
