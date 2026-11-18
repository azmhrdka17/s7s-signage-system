import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SignageService } from './signage.service';
import { SignageGateway } from '../websocket/signage.gateway';

@Controller('api/signage')
export class SignageController {
  constructor(
    private signageService: SignageService,
    private signageGateway: SignageGateway,
  ) {}

  @Get(':clientId')
  async getSignageConfig(@Param('clientId') clientId: string) {
    const config = await this.signageService.getSignageConfig(clientId);
    return {
      data: config,
    };
  }

  @Post(':clientId/content')
  async updateContent(
    @Param('clientId') clientId: string,
    @Body() data: {
      videoUrls?: string[];
      slideUrls?: string[];
      runningText?: string;
      scheduleTable?: any[];
      backgroundUrl?: string;
    },
  ) {
    const updated = await this.signageService.updateSignageContent(clientId, data);
    
    // Emit WebSocket event untuk real-time update
    const config = await this.signageService.getSignageConfig(clientId);
    this.signageGateway.emitRefresh(clientId, config);

    return {
      message: 'Content updated successfully',
      data: updated,
    };
  }
}
