import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiVersion } from '@repo/shared';

import { User } from '../../shared/auth/presentation/decorators/user.decorator.ts';
import { FeatureFlag } from '../../shared/flags/domain/flag.ts';
import { Flags } from '../../shared/flags/presentation/decorators/flags.decorator.ts';
import { ApiAuthResponses } from '../../utils/swagger/decorators.ts';
import { CalendarService } from '../application/calendar.service.ts';
import { CreateTimeBlockCommand } from '../application/commands/create-time-block.command.ts';
import { GetTimeBlocksCommand } from '../application/commands/get-time-blocks.command.ts';
import { CreateTimeBlockDto } from './dto/create-time-block.dto.ts';
import { TimeBlockResponseDto } from './dto/time-block-response.dto.ts';

@Controller({
  path: '/calendar',
  version: ApiVersion.v1,
})
@ApiBearerAuth()
@ApiTags('calendar')
@Flags(FeatureFlag.AccessEnabled)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/time-blocks/:date')
  @ApiOperation({
    description:
      'Get all calendar time blocks for the current user and day, not paged',
  })
  @ApiAuthResponses()
  @ApiOkResponse({
    type: TimeBlockResponseDto,
    isArray: true,
  })
  async getTimeBlocks(
    @User('id') userId: string,
    @Param('date') date: string,
  ): Promise<TimeBlockResponseDto[]> {
    return (
      await this.calendarService.getTimeBlocks(
        new GetTimeBlocksCommand(date, userId),
      )
    ).map(TimeBlockResponseDto.fromDomain);
  }

  @Post('/time-blocks')
  @ApiOperation({
    description: 'Create a calendar time block',
  })
  @ApiAuthResponses()
  @ApiOkResponse({
    type: TimeBlockResponseDto,
  })
  async createTimeBlock(
    @User('id') userId: string,
    @Body() dto: CreateTimeBlockDto,
  ): Promise<TimeBlockResponseDto> {
    return new TimeBlockResponseDto(
      await this.calendarService.createTimeBlock(
        new CreateTimeBlockCommand(
          dto.title,
          dto.start,
          dto.end,
          dto.taskId,
          userId,
        ),
      ),
    );
  }
}
