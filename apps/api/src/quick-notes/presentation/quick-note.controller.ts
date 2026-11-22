import { Body, Controller, Post } from "@nestjs/common";
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
import { QuickNoteCommandHandler } from "../application/handlers/quick-note.command-handler.ts";

@Controller({
  path: "quick-notes",
  version: ApiVersion.v1,
})
@ApiTags("quick-notes")
export class QuickNoteController {
  constructor(private readonly handler: QuickNoteCommandHandler) {}

  @Post()
  @ApiOperation({ summary: "Create quick note" })
  @ApiAuthErrorResponses()
  @ApiOkResponse({
    standardSchema: QuickNoteResponseSchema,
  })
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
