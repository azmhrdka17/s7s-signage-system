import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async createMediaResource(data: {
    filename: string;
    url: string;
    type: string;
    duration?: number;
  }) {
    return this.prisma.mediaResource.create({
      data,
    });
  }

  async getAllMedia() {
    return this.prisma.mediaResource.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMediaById(id: string) {
    return this.prisma.mediaResource.findUnique({
      where: { id },
    });
  }

  async deleteMedia(id: string) {
    return this.prisma.mediaResource.delete({
      where: { id },
    });
  }
}
