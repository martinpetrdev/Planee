import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

import { ApiVersion } from '@repo/shared';

import { User } from '../../shared/auth/presentation/decorators/user.decorator.js';
import { FeatureFlag } from '../../shared/flags/domain/flag.js';
import { Flags } from '../../shared/flags/presentation/decorators/flags.decorator.js';
import { ApiAuthResponses } from '../../utils/swagger/decorators.js';
import { CreateQuickNoteCommand } from '../application/create-quick-note.command.js';
import { DeleteQuickNoteCommand } from '../application/delete-quick-note.command.js';
import { ListQuickNotesCommand } from '../application/list-quick-notes.command.js';
import { QuickNotesService } from '../application/quick-notes.service.js';
import { UpdateQuickNoteCommand } from '../application/update-quick-note.command.js';
import { CreateQuickNoteDto } from './dto/create-quick-note.dto.js';
import { QuickNoteResponseDto } from './dto/quick-note-response.dto.js';
import { UpdateQuickNoteDto } from './dto/update-quick-note.dto.js';

@Controller({
  path: '/quick-notes',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@ApiTags('quick-notes')
@Flags(FeatureFlag.AccessEnabled)
export class QuickNotesController {
  constructor(private readonly quickNotesService: QuickNotesService) {}

  @Get('/')
  @ApiOperation({
    description: 'Get all quick notes for the current user, not paged',
  })
  @ApiAuthResponses()
  @ApiOkResponse({
    type: QuickNoteResponseDto,
    isArray: true,
  })
  async list(@User('id') userId: string) {
    const notes = await this.quickNotesService.list(
      new ListQuickNotesCommand(userId),
    );

    return notes.map((note) => QuickNoteResponseDto.fromDomain(note));
  }

  @Post('/')
  @ApiOperation({
    description: 'Create a quick note',
  })
  @ApiAuthResponses()
  @ApiCreatedResponse({
    type: QuickNoteResponseDto,
  })
  async create(@User('id') userId: string, @Body() dto: CreateQuickNoteDto) {
    const note = await this.quickNotesService.create(
      new CreateQuickNoteCommand(userId, dto.text),
    );

    return QuickNoteResponseDto.fromDomain(note);
  }

  @Put('/:id')
  @ApiOperation({
    description: 'Update a quick note',
  })
  @ApiAuthResponses()
  @ApiCreatedResponse({
    type: QuickNoteResponseDto,
  })
  async update(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateQuickNoteDto,
  ) {
    const note = await this.quickNotesService.update(
      new UpdateQuickNoteCommand(id, userId, dto.text),
    );

    return QuickNoteResponseDto.fromDomain(note);
  }

  @Delete('/:id')
  @ApiOperation({
    description: 'Delete a quick note',
  })
  @ApiAuthResponses()
  @ApiNoContentResponse()
  @HttpCode(HttpStatusCode.NoContent)
  async delete(@User('id') userId: string, @Param('id') id: string) {
    await this.quickNotesService.delete(new DeleteQuickNoteCommand(id, userId));
  }
}
