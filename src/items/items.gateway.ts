import { RedisService } from 'nestjs-redis';
import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8181, { namespace: '/items' })
export class ItemsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly redisService: RedisService) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ItemsGateway');

  afterInit(server: Server) {
    this.logger.log('Websocket successfully initialized!');
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('latestBidServer')
  async latestBid(
    client: Socket,
    data: { currentBid: number; id: number },
  ): Promise<void> {
    const redisClient = this.redisService.getClient();
    const incrMyKey = await redisClient.incr('myKey');

    if (incrMyKey == 1) {
      redisClient.set('myKey', 0);
    }

    this.logger.log(
      `Bid attempted. Latest Current Bid: ${data.currentBid}. Redis mykey: ${incrMyKey}`,
    );

    // Broadcast to all connected users
    this.wss.emit('latestBidClient', data.currentBid);
  }
}
