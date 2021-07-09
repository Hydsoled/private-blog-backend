import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = this.cookieParser(request.headers['cookie'] || '');
    if (!token.SESSID) {
      return false;
    }
    let user;
    try {
      user = await this.authenticateUser(token.SESSID);
    } catch (e) {
      throw new HttpException('PERMISSION ERROR', HttpStatus.FORBIDDEN);
    }
    console.log(new Date(user.exp * 1000));
    console.log(new Date(user.iat * 1000));
    return true;
  }

  cookieParser(cookie: string): any {
    const cookies = {};
    cookie.split(';').map((val) => {
      cookies[val.split('=')[0]] = val.split('=')[1];
    });
    return cookies;
  }

  async authenticateUser(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
