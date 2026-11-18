import { Controller, Post, Param, Body } from '@nestjs/common';
import { QueueService } from './queue.service';
import { SignageGateway } from '../websocket/signage.gateway';
import { SignageService } from '../signage/signage.service';

@Controller('api/signage')
export class QueueController {
  constructor(
    private queueService: QueueService,
    private signageGateway: SignageGateway,
    private signageService: SignageService,
  ) {}

  @Post(':clientId/queue/call')
  async callQueue(
    @Param('clientId') clientId: string,
    @Body() data: {
      slotNumber: number;
      loketName: string;
      currentNumber: string;
    },
  ) {
    // Update queue slot
    const updated = await this.queueService.updateQueueSlot(
      clientId,
      data.slotNumber,
      data.loketName,
      data.currentNumber,
    );

    // Emit WebSocket event untuk panggilan antrian (untuk animasi & TTS)
    this.signageGateway.emitQueue(clientId, {
      slotNumber: data.slotNumber,
      loketName: data.loketName,
      currentNumber: data.currentNumber,
    });

    // Get updated full config dan emit refresh
    const config = await this.signageService.getSignageConfig(clientId);
    this.signageGateway.emitRefresh(clientId, config);

    return {
      message: 'Queue called successfully',
      data: updated,
    };
  }
}
