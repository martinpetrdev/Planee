import { Controller, Get, SerializeOptions } from "@nestjs/common";
import { ApiVersion, DetailedUserResponseSchema } from "@repo-shared/contracts";
import { AuthenticatedUser, User } from "@repo-shared/server-auth";

import { UserRepositoryPort } from "../ports/user-repository.port.ts";

@Controller({
  path: "/users",
  version: ApiVersion.v1,
})
export class UsersController {
  constructor(private readonly repository: UserRepositoryPort) {}

  @Get("/me")
  @SerializeOptions({ schema: DetailedUserResponseSchema })
  async getMe(@User() user: AuthenticatedUser) {
    const dbUser = await this.repository.findById(user.id);

    return {
      ...user.toObject(),
      ...dbUser.toObject(),
    };
  }
}
