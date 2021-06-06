import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }

  @Post('auth/login')
  async login(@Body() data: { email: string; password: string }): Promise<any> {
    return {
      success: true,
      message: 'Login sucess',
      access_token: 'asd',
      user: { ...data },
    };
  }

  @Post('auth/logout')
  async logout(
    @Body() data: { email: string; password: string },
  ): Promise<any> {
    return data;
  }

  @Get('auth/user')
  user(): any {
    return {
      email: 'test@gmail.com',
      name: 'User 1',
      bids: [
        {
          id_bid: '60b5285383b2df3dd4132ca4',
          maxAmount: 115,
          bot: true,
          alertAmount: 90,
        },
      ],
      user: {
        email: 'test@gmail.com',
        name: 'User 1',
      },
    };
  }
}
