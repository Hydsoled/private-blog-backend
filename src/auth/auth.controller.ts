import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { UserToken } from '../services/user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const token = await this.authService.login(body);
    response.cookie('SESSID', token, {
      secure: true,
      sameSite: 'lax',
    });
    return {
      success: token,
    };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const token = await this.authService.registration(body);
    response.cookie('SESSID', token, {
      secure: true,
      sameSite: 'lax',
    });

    return {
      success: token,
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @UserToken() token: string,
  ): Promise<any> {
    const res = await this.authService.logout(token);
    response.clearCookie('SESSID');
    return res;
  }
}
