import { Module } from '@nestjs/common';
import { SignageGateway } from './signage.gateway';

@Module({
  providers: [SignageGateway],
  exports: [SignageGateway],
})
export class WebsocketModule {}
