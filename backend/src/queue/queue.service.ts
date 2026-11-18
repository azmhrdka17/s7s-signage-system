import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService) {}

  async updateQueueSlot(
    clientId: string,
    slotNumber: number,
    loketName: string,
    currentNumber: string,
  ) {
    // Check if slot exists
    const existing = await this.prisma.queueSlot.findUnique({
      where: {
        clientId_slotNumber: {
          clientId,
          slotNumber,
        },
      },
    });

    if (existing) {
      return this.prisma.queueSlot.update({
        where: {
          clientId_slotNumber: {
            clientId,
            slotNumber,
          },
        },
        data: {
          loketName,
          currentNumber,
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.queueSlot.create({
        data: {
          clientId,
          slotNumber,
          loketName,
          currentNumber,
        },
      });
    }
  }

  async getQueueSlots(clientId: string) {
    return this.prisma.queueSlot.findMany({
      where: { clientId },
      orderBy: { slotNumber: 'asc' },
    });
  }
}
