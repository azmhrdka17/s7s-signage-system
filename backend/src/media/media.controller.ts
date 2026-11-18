import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';

@Controller('api/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg/;
        const mimetype = allowedTypes.test(file.mimetype);
        const ext = allowedTypes.test(extname(file.originalname).toLowerCase());

        if (mimetype && ext) {
          return cb(null, true);
        }
        cb(new Error('Only image and video files are allowed!'), false);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const type = file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
    const url = `/resources/${file.filename}`;

    const media = await this.mediaService.createMediaResource({
      filename: file.originalname,
      url,
      type,
      duration: type === 'VIDEO' ? 10 : undefined, // default 10 detik untuk video
    });

    return {
      message: 'File uploaded successfully',
      data: media,
    };
  }

  @Get()
  async getAllMedia() {
    const media = await this.mediaService.getAllMedia();
    return {
      data: media,
    };
  }

  @Get(':id')
  async getMediaById(@Param('id') id: string) {
    const media = await this.mediaService.getMediaById(id);
    return {
      data: media,
    };
  }

  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    await this.mediaService.deleteMedia(id);
    return {
      message: 'Media deleted successfully',
    };
  }
}
