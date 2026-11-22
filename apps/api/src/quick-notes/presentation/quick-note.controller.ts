import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions,
} from "@nestjs/common";
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
  type UpdateQuickNote,
  UpdateQuickNoteSchema,
} from "@repo-shared/contracts";
import { User } from "@repo-shared/server-auth";
import { z } from "zod";

import { CreateQuickNoteCommand } from "../application/commands/create-quick-note.command.ts";
import { DeleteQuickNoteCommand } from "../application/commands/delete-quick-note.command.ts";
import { ListQuickNoteCommand } from "../application/commands/list-quick-note.command.ts";
import { UpdateQuickNoteCommand } from "../application/commands/update-quick-note.command.ts";
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

  @Put("/:quickNoteId")
  @ApiOperation({ summary: "Update quick note" })
  @ApiAuthErrorResponses()
  @ApiOkResponse({
    standardSchema: QuickNoteResponseSchema,
  })
  @SerializeOptions({ schema: QuickNoteResponseSchema })
  public async update(
    @User("id") userId: string,
    @Param("quickNoteId") quickNoteId: string,
    @Body({ schema: UpdateQuickNoteSchema }) dto: UpdateQuickNote,
  ) {
    return await this.handler.handleUpdate(
      new UpdateQuickNoteCommand({
        ...dto,
        id: quickNoteId,
        userId,
      }),
    );
  }

  @Delete("/:quickNoteId")
  @ApiOperation({ summary: "Delete quick note" })
  @ApiAuthErrorResponses()
  @ApiOkResponse()
  @SerializeOptions({ schema: z.void() })
  public async delete(
    @User("id") userId: string,
    @Param("quickNoteId") quickNoteId: string,
  ) {
    return await this.handler.handleDelete(
      new DeleteQuickNoteCommand({
        id: quickNoteId,
        userId,
      }),
    );
  }
}
