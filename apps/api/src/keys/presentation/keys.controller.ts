import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import {
  ApiAuthErrorResponses,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@repo-libs/nestjs-scalar';
import {
  ApiVersion,
  CreatedMcpKeyResponseSchema,
  type CreateMcpKey,
  CreateMcpKeySchema,
  McpKeyResponseSchema,
} from '@repo-shared/contracts';
import { User } from '@repo-shared/server-auth';

import { CreateMcpKeyCommand } from '../application/commands/create-mcp-key.command.ts';
import { ListMcpKeyCommand } from '../application/commands/list-mcp-key.command.ts';
import { McpKeyCommandHandler } from '../application/handlers/mcp-key.command-handler.ts';

@Controller({
  path: '/keys',
  version: ApiVersion.v1,
})
@ApiTags('keys')
export class KeysController {
  constructor(private readonly mcpKeyHandler: McpKeyCommandHandler) {}

  @Get('/mcp')
  @ApiOperation({ summary: 'List MCP keys' })
  @ApiAuthErrorResponses()
  @ApiOkResponse({
    standardSchema: McpKeyResponseSchema,
    isArray: true,
  })
  @SerializeOptions({ schema: McpKeyResponseSchema })
  async listMcp(@User('id') userId: string) {
    const entities = await this.mcpKeyHandler.handleList(
      new ListMcpKeyCommand({
        userId,
      }),
    );

    return entities.map((entity) => entity.toObject());
  }

  @Post('/mcp')
  @ApiOperation({ summary: 'Create MCP key' })
  @ApiAuthErrorResponses()
  @ApiOkResponse({
    standardSchema: CreatedMcpKeyResponseSchema,
  })
  @SerializeOptions({ schema: CreatedMcpKeyResponseSchema })
  async createMcp(
    @User('id') userId: string,
    @Body({ schema: CreateMcpKeySchema }) dto: CreateMcpKey,
  ) {
    const entity = await this.mcpKeyHandler.handleCreate(
      new CreateMcpKeyCommand({
        userId,
        name: dto.name,
      }),
    );

    return entity.toObject();
  }
}
