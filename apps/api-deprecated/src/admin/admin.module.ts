import { Module } from '@nestjs/common';

import { AdminController } from './presentation/admin.controller.js';
import { ProgramsModule } from './programs/programs.module.js';

@Module({
  imports: [ProgramsModule],
  controllers: [AdminController],
})
export class AdminModule {}
