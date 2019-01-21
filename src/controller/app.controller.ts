import { Controller, Get, Post, HttpCode, Req, Body } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { request } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('regist')
  getHello(@Body() data) {
    return this.appService.getHello(data);
  }

  @Post('login')
  login (@Body() data) {
    return this.appService.login(data)
  }
}
