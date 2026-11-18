import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { MediaModule } from './media/media.module';
import { SignageModule } from './signage/signage.module';
import { QueueModule } from './queue/queue.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/resources',
    }),
    PrismaModule,
    MediaModule,
    SignageModule,
    QueueModule,
    WebsocketModule,
  ],
})
export class AppModule {}
