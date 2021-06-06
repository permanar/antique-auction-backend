import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async getHello(): Promise<any> {
    const client = await this.redisService.getClient().incr('mykey');

    return client;
    // return 'Hello World!';
  }
}
