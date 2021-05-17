import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') pass: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const user = await this.appService.findOne({ email });
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const token = await this.appService.generateToken(
      user.nickname,
      user.email,
      user.password,
    );
    await this.appService.updateUser({ email: user.email }, token);
    response.cookie('SESSID', token, {
      secure: true,
      sameSite: true,
    });
    return true;
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('nickname') nickname: string,
    @Body('password') pass: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    let user = await this.appService.findOne({ email });
    if (user) {
      throw new HttpException('EMAIL_EXIST', HttpStatus.FORBIDDEN);
    }
    const hashedPassword = await bcrypt.hash(pass, 12);
    const token = await this.appService.generateToken(
      nickname,
      email,
      hashedPassword,
    );
    user = await this.appService.createUser(nickname, email, hashedPassword, token);
    if (!user) throw new BadRequestException();

    response.cookie('SESSID', token, {
      secure: true,
      sameSite: true,
    });

    return true;
  }

  @Post('logout')
  async logout(
    @Body('ses_id') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const user = await this.appService.updateUser({ token }, '');
    response.clearCookie('SESSID');
    return !!user.nModified;
  }
}
