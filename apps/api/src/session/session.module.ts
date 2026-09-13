import { Module } from '@nestjs/common';
import { SessionController } from './presentation/session.controller.js';

@Module({
  imports: [],
  controllers: [SessionController],
})
export class SessionModule {}
