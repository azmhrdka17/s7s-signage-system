import { Module } from '@nestjs/common';
import { SignageController } from './signage.controller';
import { SignageService } from './signage.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [SignageController],
  providers: [SignageService],
  exports: [SignageService], // Export agar bisa digunakan di module lain
})
export class SignageModule {}
