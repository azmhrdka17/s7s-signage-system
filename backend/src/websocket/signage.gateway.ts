import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SignageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // Emit refresh event untuk update konten
  emitRefresh(clientId: string, data: any) {
    this.server.emit(`refresh:${clientId}`, data);
    console.log(`📡 Emitted refresh:${clientId}`);
  }

  // Emit queue event untuk panggilan antrian
  emitQueue(clientId: string, data: any) {
    this.server.emit(`queue:${clientId}`, data);
    console.log(`📡 Emitted queue:${clientId}`, data);
  }
}
