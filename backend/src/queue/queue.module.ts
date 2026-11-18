import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { SignageModule } from '../signage/signage.module';

@Module({
  imports: [WebsocketModule, SignageModule],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
