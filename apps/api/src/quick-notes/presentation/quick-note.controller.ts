import { Body, Controller, Get, Post, SerializeOptions } from "@nestjs/common";
import {
  ApiAuthErrorResponses,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@repo-libs/nestjs-scalar";
import {
  ApiVersion,
  type CreateQuickNote,
  CreateQuickNoteSchema,
  QuickNoteResponseSchema,
} from "@repo-shared/contracts";
import { User } from "@repo-shared/server-auth";

import { CreateQuickNoteCommand } from "../application/commands/create-quick-note.command.ts";
import { ListQuickNoteCommand } from "../application/commands/list-quick-note.command.ts";
import { QuickNoteCommandHandler } from "../application/handlers/quick-note.command-handler.ts";

@Controller({
  path: "quick-notes",
  version: ApiVersion.v1,
})
@ApiTags("quick-notes")
export class QuickNoteController {
  constructor(private readonly handler: QuickNoteCommandHandler) {}

  @Get()
  @ApiOperation({ summary: "List quick notes" })
  @ApiAuthErrorResponses()
  @ApiOkResponse({
    standardSchema: QuickNoteResponseSchema,
    isArray: true,
  })
  @SerializeOptions({ schema: QuickNoteResponseSchema })
  public async list(@User("id") userId: string) {
    const entities = await this.handler.handleList(
      new ListQuickNoteCommand({
        userId,
      }),
    );

    return entities.map((entity) => entity.toObject());
  }

  @Post()
  @ApiOperation({ summary: "Create quick note" })
  @ApiAuthErrorResponses()
  @ApiOkResponse({
    standardSchema: QuickNoteResponseSchema,
  })
  @SerializeOptions({ schema: QuickNoteResponseSchema })
  public async create(
    @User("id") userId: string,
    @Body({ schema: CreateQuickNoteSchema }) dto: CreateQuickNote,
  ) {
    return await this.handler.handleCreate(
      new CreateQuickNoteCommand({
        ...dto,
        userId,
      }),
    );
  }
}
