import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { UserRole } from '../../../shared/auth/domain/user-role.js';
import { Roles } from '../../../shared/auth/presentation/decorators/roles.decorator.js';
import { ApiAuthResponses } from '../../../utils/swagger/decorators.js';
import { EapProgramService } from '../application/eap-program.service.js';
import { EapInviteResponseDto } from './dto/eapInvite-response.dto.js';

@Controller({
  path: '/admin/programs',
  version: ApiVersion.v1,
})
@Roles(UserRole.Admin)
@ApiTags('admin/programs')
export class ProgramsController {
  constructor(private readonly eapProgram: EapProgramService) {}

  // TODO: Temporary, remove after removing EAP
  @Post('/eap/invite')
  @ApiOperation({
    description: 'Generates invite ID for early access program. Temporary.',
  })
  @ApiAuthResponses()
  @ApiOkResponse({
    type: EapInviteResponseDto,
  })
  async inviteEap() {
    const invite = await this.eapProgram.invite();

    return EapInviteResponseDto.fromDomain(invite);
  }
}
