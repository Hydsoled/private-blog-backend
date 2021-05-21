import { BadRequestException, Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {
  }

  @Post('login')
  async login(
    @Body('email') username: string,
    @Body('password') pass: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const value = this.authService.detectValue(username);
    let user;
    if (value) {
      user = await this.authService.findOne({ [value]: username });
    }
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const token = await this.authService.generateToken(
      user.nickname,
      user.email,
      user.password,
    );
    await this.authService.updateUser({ email: user.email }, token);
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
    let user = true;
    if (this.authService.validRegistration(email, nickname)) {
      user = await this.authService.findOne({ email });
    }
    if (user) {
      throw new HttpException('EMAIL_EXIST', HttpStatus.FORBIDDEN);
    }
    const hashedPassword = await bcrypt.hash(pass, 12);
    const token = await this.authService.generateToken(
      nickname,
      email,
      hashedPassword,
    );
    user = await this.authService.createUser(
      nickname,
      email,
      hashedPassword,
      token,
    );
    if (!user) {
      throw new BadRequestException();
    }

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
    const user = await this.authService.updateUser({ token }, '');
    response.clearCookie('SESSID');
    return !!user.nModified;
  }
}
