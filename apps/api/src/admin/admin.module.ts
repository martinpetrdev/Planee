import { Module } from '@nestjs/common';

import { AdminController } from './presentation/admin.controller.js';

@Module({
  controllers: [AdminController],
})
export class AdminModule {}
