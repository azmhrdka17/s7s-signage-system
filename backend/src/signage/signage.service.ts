import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SignageService {
  constructor(private prisma: PrismaService) {}

  async getSignageConfig(clientId: string) {
    // Ensure client exists
    let client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        signageContent: true,
        queueSlots: {
          orderBy: { slotNumber: 'asc' },
        },
      },
    });

    if (!client) {
      // Create default client if not exists
      client = await this.prisma.client.create({
        data: {
          id: clientId,
          description: 'SIGNAGE ANTRIAN',
          signageContent: {
            create: {
              videoUrls: '[]',
              slideUrls: '[]',
              runningText: 'Selamat Datang',
              scheduleTable: '[]',
              backgroundUrl: '',
            },
          },
          queueSlots: {
            create: [
              { slotNumber: 1, loketName: 'Loket 1', currentNumber: '' },
              { slotNumber: 2, loketName: 'Loket 2', currentNumber: '' },
              { slotNumber: 3, loketName: 'Loket 3', currentNumber: '' },
              { slotNumber: 4, loketName: 'Loket 4', currentNumber: '' },
              { slotNumber: 5, loketName: 'Loket 5', currentNumber: '' },
            ],
          },
        },
        include: {
          signageContent: true,
          queueSlots: {
            orderBy: { slotNumber: 'asc' },
          },
        },
      });
    }

    // Parse JSON fields
    const content = client.signageContent;
    return {
      client: {
        id: client.id,
        description: client.description,
      },
      content: {
        videoUrls: content ? JSON.parse(content.videoUrls) : [],
        slideUrls: content ? JSON.parse(content.slideUrls) : [],
        runningText: content ? content.runningText : '',
        scheduleTable: content ? JSON.parse(content.scheduleTable) : [],
        backgroundUrl: content ? content.backgroundUrl : '',
      },
      queueSlots: client.queueSlots,
    };
  }

  async updateSignageContent(clientId: string, data: {
    videoUrls?: string[];
    slideUrls?: string[];
    runningText?: string;
    scheduleTable?: any[];
    backgroundUrl?: string;
  }) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { signageContent: true },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const updateData: any = {};
    if (data.videoUrls !== undefined) updateData.videoUrls = JSON.stringify(data.videoUrls);
    if (data.slideUrls !== undefined) updateData.slideUrls = JSON.stringify(data.slideUrls);
    if (data.runningText !== undefined) updateData.runningText = data.runningText;
    if (data.scheduleTable !== undefined) updateData.scheduleTable = JSON.stringify(data.scheduleTable);
    if (data.backgroundUrl !== undefined) updateData.backgroundUrl = data.backgroundUrl;

    if (client.signageContent) {
      return this.prisma.signageContent.update({
        where: { clientId },
        data: updateData,
      });
    } else {
      return this.prisma.signageContent.create({
        data: {
          clientId,
          videoUrls: JSON.stringify(data.videoUrls || []),
          slideUrls: JSON.stringify(data.slideUrls || []),
          runningText: data.runningText || '',
          scheduleTable: JSON.stringify(data.scheduleTable || []),
          backgroundUrl: data.backgroundUrl || '',
        },
      });
    }
  }
}
