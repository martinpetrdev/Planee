import { Global, Module } from "@nestjs/common";
import { UserProvisionerPort } from "@repo-shared/server-auth";

import { DbUserProvisioner } from "./infrastructure/db-user.provisioner.ts";

@Global()
@Module({
  providers: [
    {
      provide: UserProvisionerPort,
      useClass: DbUserProvisioner,
    },
  ],
  exports: [UserProvisionerPort],
})
export class UsersModule {}
